const Language = require("../router/course");

// Function to Get All Languages
const getAllLanguages = async (req, res) => {
  try {
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

    const languages = Object.values(formattedResult);
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to Get Chapters by Language
const getChaptersByLanguage = async (req, res) => {
  const language = req.params.language;

  try {
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

    const chapters = result[0]?.chapters || [];
    if (chapters.length === 0) {
      return res.status(404).json({ message: "No chapters found for this language" });
    }

    res.status(200).json({ language, chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to Get Lessons for a Specific Chapter and Language
const getLessonsByLanguageAndChapter = async (req, res) => {
  const language = req.params.language;
  const chapterId = req.params.chapterId;

  try {
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

    const lessons = result[0]?.lessons || [];
    if (lessons.length === 0) {
      return res.status(404).json({ message: "No lessons found for this chapter" });
    }

    res.status(200).json({ lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to Get Questions by Language, Chapter, and Lesson
const getQuestionsByLanguageChapterLesson = async (req, res) => {
  const language = req.params.language;
  const chapterId = req.params.chapterId;
  const lessonId = req.params.lessonId;

  if (!language || !chapterId || !lessonId) {
    return res.status(400).json({
      message: "Language, Chapter ID, and Lesson ID are required",
    });
  }

  try {
    const pipeline = [
      {
        $match: {
          [language]: { $exists: true },
        },
      },
      {
        $project: {
          chapters: { $objectToArray: `$${language}` },
        },
      },
      {
        $unwind: "$chapters",
      },
      {
        $match: {
          "chapters.k": chapterId,
        },
      },
      {
        $project: {
          lessons: { $objectToArray: "$chapters.v.lessons" },
        },
      },
      {
        $unwind: "$lessons",
      },
      {
        $match: {
          "lessons.k": lessonId,
        },
      },
      {
        $unwind: "$lessons.v.questions",
      },
      {
        $project: {
          questions: "$lessons.v.questions",
        },
      },
    ];

    const result = await Language.aggregate(pipeline);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No questions found for this lesson" });
    }

    res.status(200).json({ questions: result });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllLanguages,
  getChaptersByLanguage,
  getLessonsByLanguageAndChapter,
  getQuestionsByLanguageChapterLesson,
};
