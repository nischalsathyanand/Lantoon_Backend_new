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
  updateLanguage,
  deleteLanguage,
} = require("../controllers/languageController");

const {
  createChapter,
  updateChapter,
  deleteChapter,
} = require("../controllers/chapterController");
const { createLesson, updateLesson, deleteLesson }=require("../controllers/lessonController")

// Endpoints for Languages
router.get("/v1/languages", getAllLanguages);
router.post("/v1/languages", createLanguage);
router.put("/v1/languages/:languageId", updateLanguage);
router.delete("/v1/languages/:languageId", deleteLanguage);

// Endpoints for Chapters within a Language
router.get("/v1/languages/:languageId/chapters", getChaptersByLanguage);
router.post("/v1/languages/:languageId/chapters", createChapter);
router.put("/v1/languages/:languageId/chapters/:chapterId", updateChapter);
router.delete("/v1/languages/:languageId/chapters/:chapterId", deleteChapter);

// Endpoints for Lessons within a Chapter
router.get("/v1/languages/:languageId/chapters/:chapterId/lessons", getLessonsByLanguageAndChapter);
router.post("/v1/languages/:languageId/chapters/:chapterId/lessons", createLesson);
router.put("/v1/languages/:languageId/chapters/:chapterId/lessons/:lessonId", updateLesson); 
router.delete("/v1/languages/:languageId/chapters/:chapterId/lessons/:lessonId", deleteLesson); 

// Endpoints for Questions within a Lesson
router.get("/v1/languages/:languageId/chapters/:chapterId/lessons/:lessonId/questions", getQuestionsByLanguageChapterLesson);

module.exports = router;
