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

const {
  createChapter,
  getChapterById,
  updateChapterById,
  deleteChapterById,
} = require("../controllers/chapterController");

// Endpoints for all Course
router.get("/v1/languages", getAllLanguages);

router.get("/v1/chapters/:language", getChaptersByLanguage);

router.get(
  "/v1/chapters/:language/lessons/:chapterId",
  getLessonsByLanguageAndChapter
);

router.get(
  "/v1/chapters/:language/lessons/:chapterId/questions/:lessonId",
  getQuestionsByLanguageChapterLesson
);

//CRUD FOR language

router.post("/v1/courses/languages", createLanguage);

router.get("/v1/courses/languages/:languageId", getLanguageById);

router.put("/v1/courses/languages/:languageId", updateLanguageById); 

router.delete("/v1/courses/languages/:languageId", deleteLanguageById);

//CRUD FOR chapter
router.post("/v1/courses/languages/:languageId/chapters", createChapter);
router.get(
  "/v1/courses/languages/:languageId/chapters/:chapterId",
  getChapterById
);
router.put(
  "/v1/courses/languages/:languageId/chapters/:chapterId",
  updateChapterById
);
router.delete(
  "/v1/courses/languages/:languageId/chapters/:chapterId",
  deleteChapterById
);

module.exports = router;
