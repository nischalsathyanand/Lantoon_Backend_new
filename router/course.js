const express = require("express");
const router = express.Router();
const {
  getAllLanguages,
  getChaptersByLanguage,
  getLessonsByLanguageAndChapter,
  getQuestionsByLanguageChapterLesson,
} = require("../controllers/courseController");

const {
  createLanguage,updateLanguageById,deleteLanguageById
}=require("../controllers/languageController")


const {
  createChapter,
  updateChapterById,
  deleteChapterById,
} = require("../controllers/chapterController");

// Endpoints for all Course
router.get("/v1/languages", getAllLanguages);

router.get("/v1/language/:languageId/chapters", getChaptersByLanguage);

router.get(
  "/v1/chapters/:languageId/lessons/:chapterId",
  getLessonsByLanguageAndChapter
);

router.get(
  "/v1/chapters/:languageId/lessons/:chapterId/questions/:lessonId",
  getQuestionsByLanguageChapterLesson
);
// Crud for language
router.post("/v1/courses/language", createLanguage);
router.put("/v1/courses/languages/:languageId", updateLanguageById); 
router.delete("/v1/courses/languages/:languageId", deleteLanguageById);


//crud for chapter
router.post("/v1/courses/languages/:languageId/chapters", createChapter);

router.put(
  "/v1/courses/languages/:languageId/chapters/:chapterId",
  updateChapterById
);
router.delete(
  "/v1/courses/languages/:languageId/chapters/:chapterId",
  deleteChapterById
);

module.exports = router;
