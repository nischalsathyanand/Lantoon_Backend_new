const Language = require("../models/course");

// Function to Get All Languages
const getAllLanguages = async (req, res) => {
  try {
    const language = await Language.find({}, "_id name");

    res.json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Function to Get Chapters by Language
const getChaptersByLanguage = async (req, res) => {
  try {
    const languageId = req.params.languageId;

    if (!languageId) {
      return res.status(400).json({ message: "Language ID is required." });
    }

    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    const chapterDetails = [];

    for (const key in language._doc) {
      if (key.startsWith("chapter_")) {
        const chapter = language._doc[key];
        if (
          chapter &&
          typeof chapter === "object" &&
          chapter._id &&
          chapter.name
        ) {
          chapterDetails.push({ _id: chapter._id, name: chapter.name });
        }
      }
    }

    if (chapterDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No chapters found for this language." });
    }

    res.status(200).json({ chapters: chapterDetails });
  } catch (error) {
    console.error("Error retrieving chapters:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving chapters." });
  }
};

// Function to Get Lessons for a Specific Chapter and Language
const getLessonsByLanguageAndChapter = async (req, res) => {
  try {
    const { languageId, chapterId } = req.params;
   
    if (!languageId || !chapterId) {
      return res
        .status(400)
        .json({ message: "Language ID and Chapter ID are required." });
    }

    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    let chapter = null;
    for (const key in language._doc) {
      if (key.startsWith("chapter_")) {
        const ch = language._doc[key];
        if (ch && ch._id === chapterId) {
          chapter = ch;
          break;
        }
      }
    }

    if (!chapter) {
      return res.status(404).json({
        message: `Chapter with ID ${chapterId} not found in this language.`,
      });
    }

    const lessons = [];
    if (chapter.lessons) {
      for (const lessonKey in chapter.lessons) {
        const lesson = chapter.lessons[lessonKey];
        lessons.push({ _id: lesson._id, name: lesson.name });
      }
    }

    if (lessons.length === 0) {
      return res
        .status(404)
        .json({ message: "No lessons found for this chapter." });
    }

    res.status(200).json({ lessons });
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving lessons." });
  }
};

// Function to Get Questions by Language, Chapter, and Lesson
const getQuestionsByLanguageChapterLesson = async (req, res) => {
  try {
    const { languageId, chapterId, lessonId } = req.params;

    if (!languageId || !chapterId || !lessonId) {
      return res.status(400).json({
        message: "Language ID, Chapter ID, and Lesson ID are required.",
      });
    }

    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    let chapter = null;
    for (const key in language._doc) {
      if (key.startsWith("chapter_")) {
        const ch = language._doc[key];
        if (ch && ch._id === chapterId) {
          chapter = ch;
          break;
        }
      }
    }

    if (!chapter) {
      return res.status(404).json({
        message: `Chapter with ID ${chapterId} not found in this language.`,
      });
    }

    let lesson = null;
    if (chapter.lessons) {
      for (const lessonKey in chapter.lessons) {
        const ls = chapter.lessons[lessonKey];
        if (ls && ls._id === lessonId) {
          lesson = ls;
          break;
        }
      }
    }

    if (!lesson) {
      return res.status(404).json({
        message: `Lesson with ID ${lessonId} not found in this chapter.`,
      });
    }

    const questions = [];
    if (lesson.questions) {
      for (const question of lesson.questions) {
        questions.push({
          _id: question._id,
          order_id: question.order_id,
          question_type: question.question_type,
          text: question.text,
          image1: question.image1,
          image2: question.image2,
          audio1: question.audio1,
          audio2: question.audio2,
          answerText: question.answerText,
        });
      }
    }

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this lesson." });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving questions." });
  }
};

module.exports = {
  getAllLanguages,
  getChaptersByLanguage,
  getLessonsByLanguageAndChapter,
  getQuestionsByLanguageChapterLesson,
};
