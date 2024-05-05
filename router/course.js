const express = require("express");
const router = express.Router();
const {
  getAllLanguages,
  getChaptersByLanguage,
  getLessonsByLanguageAndChapter,
  getQuestionsByLanguageChapterLesson,
} = require("../controllers/courseController");

// Endpoints for all Course
router.get("/v1/languages", getAllLanguages);

router.get("/v1/language/:languageId/chapters", getChaptersByLanguage);

router.get(
  "/v1/chapters/:languageId/lessons/:chapterId",
  getLessonsByLanguageAndChapter
);

router.get(
  "/v1/chapters/:language/lessons/:chapterId/questions/:lessonId",
  getQuestionsByLanguageChapterLesson
);


module.exports = router;
