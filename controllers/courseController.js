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

    
    const languageObject = language.toObject();

  
    for (const key in languageObject) {
      if (key.startsWith("chapter_")) {
        const chapter = languageObject[key];

    
        if (typeof chapter === "object" && chapter._id && chapter.name) {
          chapterDetails.push({ _id: chapter._id, name: chapter.name });
        } else {
          console.warn(
            `Key ${key} is not a valid chapter or does not have required properties`
          );
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
    console.log(languageId,chapterId)

    if (!languageId || !chapterId) {
      return res.status(400).json({ message: "Language ID and Chapter ID are required." });
    }

    const language = await Language.findById(languageId);
    console.log(language)

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    const chapterKey = `chapter_${chapterId}`;
    console.log(chapterKey)

    const chapter = language[chapterKey];
    console.log(cha)

    if (!chapter) {
      return res.status(404).json({ message: `Chapter with ID ${chapterId} not found in this language.` });
    }

    const lessonDetails = [];

    if (chapter.lessons) {
      for (const key in chapter.lessons) {
        if (key.startsWith("lesson_")) {
          const lesson = chapter.lessons[key];
          if (lesson && lesson._id && lesson.name) {
            lessonDetails.push({ _id: lesson._id, name: lesson.name });
          }
        }
      }
    }

    if (lessonDetails.length === 0) {
      return res.status(404).json({ message: "No lessons found for this chapter." });
    }

    res.status(200).json({ lessons: lessonDetails });
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res.status(500).json({ message: "An error occurred while retrieving lessons." });
  }
};




// Function to Get Questions by Language, Chapter, and Lesson
const getQuestionsByLanguageChapterLesson = async (req, res) => {
  
};

module.exports = {
  getAllLanguages,
  getChaptersByLanguage,
  getLessonsByLanguageAndChapter,
  getQuestionsByLanguageChapterLesson,
};
