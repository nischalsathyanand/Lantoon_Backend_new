const express = require("express");
const router = express.Router();
const {
  getAllLanguages,
  getChaptersByLanguage,
  getLessonsByLanguageAndChapter,
  getQuestionsByLanguageChapterLesson,
} = require("../controllers/courseController");
const {
  createLanguage,
  getLanguageById,
  updateLanguageById,
  deleteLanguageById,
  
} = require("../controllers/languageController");

const { createChapter,getChapterById ,updateChapterById,deleteChapterById } = require("../controllers/chapterController");

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
    console.log(language);

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

router.get(
  "/v1/chapters/:language/lessons/:chapterId/questions/:lessonId",
  async (req, res) => {
    try {
      const language = req.params.language;
      const chapterId = req.params.chapterId;
      const lessonId = req.params.lessonId;

      if (!language || !chapterId || !lessonId) {
        return res.status(400).json({
          message: "Language, Chapter ID, and Lesson ID are required",
        });
      }

      const questions = await getQuestionsByLanguageChapterLesson(
        language,
        chapterId,
        lessonId
      );

      if (!questions || questions.length === 0) {
        return res
          .status(404)
          .json({ message: "No questions found for this lesson" });
      }

      res.status(200).json({ questions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//CRUD FOR language

router.post("/v1/courses/languages", createLanguage);

router.get("/v1/courses/languages/:languageId", getLanguageById);

router.put("/v1/courses/languages/:languageId", updateLanguageById); // Ensure updateLanguageById is imported and not undefined

router.delete("/v1/courses/languages/:languageId", deleteLanguageById);

//CRUD FOR chapter
router.post("/v1/courses/languages/:languageId/chapters",createChapter);
router.get('/v1/courses/languages/:languageId/chapters/:chapterId', getChapterById);
router.put('/v1/courses/languages/:languageId/chapters/:chapterId', updateChapterById); 
router.delete('/v1/courses/languages/:languageId/chapters/:chapterId', deleteChapterById); // DELETE method for deleting a chapter


module.exports = router;
