const express = require("express");
const router = express.Router();
const Language = require("../models/Language");

// Function to Get All Languages
const getAllLanguages = async () => {
  const result = await Language.aggregate([
    { $project: { keys: { $objectToArray: "$$ROOT" } } },
    { $unwind: "$keys" },
    { $match: { "keys.k": { $ne: "_id" } } },
    { $group: { _id: null, keys: { $addToSet: "$keys.k" } } },
    { $project: { _id: 0, keys: 1 } },
  ]);

  const formattedResult = {};
  result[0].keys.forEach((key) => {
    formattedResult[key] = key;
  });

  return Object.values(formattedResult);
};

// Function to Get Chapters by Language
const getChaptersByLanguage = async (language) => {
  const pipeline = [
    {
      $match: { [language]: { $exists: true } },
    },
    {
      $project: {
        _id: 0,
        [language]: {
          $objectToArray: `$${language}`,
        },
      },
    },
    {
      $project: {
        chapters: {
          $map: {
            input: `$${language}`,
            as: "chapter",
            in: {
              chapterName: "$$chapter.k",
              chapterId: "$$chapter.v._id",
            },
          },
        },
      },
    },
  ];

  const result = await Language.aggregate(pipeline);
  return result[0]?.chapters || [];
};

// Function to Get Lessons for a Specific Chapter and Language
const getLessonsByLanguageAndChapter = async (language, chapterId) => {
  const pipeline = [
    {
      $match: { [language]: { $exists: true } },
    },
    {
      $project: {
        lessons: {
          $map: {
            input: { $objectToArray: `$${language}.${chapterId}.lessons` },
            as: "lesson",
            in: {
              _id: "$$lesson.v._id",
              lessonName: "$$lesson.k",
            },
          },
        },
      },
    },
  ];

  const result = await Language.aggregate(pipeline);

  return result[0]?.lessons || [];
};


// Function to Get Questions
const getQuestionsByLanguageChapterLesson = async (language, chapterId, lessonId) => {
    const pipeline = [
      {
        $match: { [language]: { $exists: true } }, // Ensure the language exists
      },
      {
        $project: {
          chapters: {
            $objectToArray: `$${language}`, // Convert language object to key-value pairs
          },
        },
      },
      {
        $unwind: "$chapters", // Split into individual chapters
      },
      {
        $match: { "chapters.k": chapterId }, // Match the specified chapter
      },
      {
        $project: {
          lessons: {
            $objectToArray: `$chapters.v.lessons`, // Convert lessons to key-value pairs
          },
        },
      },
      {
        $unwind: "$lessons", // Split into individual lessons
      },
      {
        $match: { "lessons.k": lessonId }, // Match the specified lesson
      },
      {
        $project: {
          questions: {
            $objectToArray: "$lessons.v.questions", // Convert questions to key-value pairs
          },
        },
      },
      {
        $unwind: {
          path: "$questions", // Split into individual questions
          preserveNullAndEmptyArrays: true, // Avoid breaking if questions are null/empty
        },
      },
      {
        $project: {
          questionId: "$questions.v._id", // Question ID
          questionText: "$questions.k",  // Question text
        },
      },
    ];
  
    const result = await Language.aggregate(pipeline); // Execute the pipeline
    return result.filter((doc) => doc.questionId); // Return only valid questions
  };
  

// Endpoint to Get All Languages
router.get("/v1/languages", async (req, res) => {
  try {
    const languages = await getAllLanguages();
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to Get Chapters for a Specific Language
router.get("/v1/chapters/:language", async (req, res) => {
  try {
    const language = req.params.language;

    const chapters = await getChaptersByLanguage(language);

    if (chapters.length === 0) {
      return res
        .status(404)
        .json({ message: "No chapters found for this language" });
    }

    res.status(200).json({ language, chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to Get Lessons for a Specific Chapter and Language

router.get("/v1/chapters/:language/lessons/:chapterId", async (req, res) => {
  try {
    const language = req.params.language;
    const chapterId = req.params.chapterId;

    const lessons = await getLessonsByLanguageAndChapter(language, chapterId);

    if (!lessons || lessons.length === 0) {
      return res
        .status(404)
        .json({ message: "No lessons found for this chapter" });
    }

    res.status(200).json({ lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Endpoint to Get Questions by Lesson ID
router.get("/v1/chapters/:language/lessons/:chapterId/questions/:lessonId", async (req, res) => {
    try {
      const language = req.params.language;
      const chapterId = req.params.chapterId;
      const lessonId = req.params.lessonId;
  
      if (!language || !chapterId || !lessonId) {
        return res.status(400).json({ message: "Language, Chapter ID, and Lesson ID are required" });
      }
  
      const questions = await getQuestionsByLanguageChapterLesson(language, chapterId, lessonId);
  
      if (!questions || questions.length === 0) { 
        return res.status(404).json({ message: "No questions found for this lesson" });
      }
  
      res.status(200).json({ questions }); 
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  
  
  
module.exports = router;
