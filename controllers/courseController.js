const Language = require("../models/course");

// Function to Get All Languages
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find({}, "_id name"); // Only fetching IDs and names
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to Get Chapters by Language
const getChaptersByLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;

    if (!languageId) {
      return res.status(400).json({ message: "Language ID is required." });
    }

    const language = await Language.findById(languageId, "chapters");

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    const chapters = Array.from(language.chapters.values());

    const chapterDetails = chapters.map((chapter) => ({
      _id: chapter._id,
      name: chapter.name,
    }));

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

    const chapters = language.chapters;

    let targetChapter = null;
    for (const key of chapters.keys()) {
      if (chapters.get(key)._id === chapterId) {
        targetChapter = chapters.get(key);
        break;
      }
    }

    if (!targetChapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    const lessons = targetChapter.lessons
      ? Array.from(targetChapter.lessons.values())
      : [];

    const lessonDetails = lessons.map((lesson) => ({
      _id: lesson._id,
      name: lesson.name,
    }));

    res.status(200).json({ lessons: lessonDetails });
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving lessons." });
  }
};

const getQuestionsByLanguageChapterLesson = async (req, res) => {
  try {
    const { languageId, chapterId, lessonId } = req.params;

    if (!languageId || !chapterId || !lessonId) {
      return res
        .status(400)
        .json({
          message: "Language ID, Chapter ID, and Lesson ID are required.",
        });
    }

    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    const chapters = language.chapters;
    let targetChapter = null;

    for (const key of chapters.keys()) {
      if (chapters.get(key)._id === chapterId) {
        targetChapter = chapters.get(key);
        break;
      }
    }

    if (!targetChapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    const lessons = targetChapter.lessons
      ? Array.from(targetChapter.lessons.values())
      : [];
    const targetLesson = lessons.find((lesson) => lesson._id === lessonId);

    if (!targetLesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const questions = targetLesson.questions
      ? Array.from(targetLesson.questions.values())
      : [];

    const questionDetails = questions.map((question) => ({
      order_id: question.order_id,
      question_type: question.question_type,
      text: question.text,
      image1: question.image1,
      image2: question.image2,
      audio1: question.audio1,
      audio2: question.audio2,
      answerText: question.answerText,
    }));

    res.status(200).json({ questions: questionDetails });
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
