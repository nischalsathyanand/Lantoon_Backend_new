const Language = require("../models/course");
const generateId = require("../utils/genarateId");
//Create a new lesson within a Chapter
const createLesson = async (req, res) => {
    try {
      const { languageId, chapterId } = req.params;
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: "Lesson name is required." });
      }
  
      const language = await Language.findById(languageId);
      if (!language) {
        return res.status(404).json({ message: "Language not found." });
      }
  
      const chapter = Array.from(language.chapters.values()).find(
        (ch) => ch._id === chapterId
      );
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found." });
      }
  
      if (chapter.lessons.has(name)) {
        return res.status(400).json({ message: "Lesson with this name already exists." });
      }
  
      const lessonId = generateId();
  
      const newLesson = {
        _id: lessonId,
        name,
        questions: [],
      };
  
      chapter.lessons.set(name, newLesson);
  
      await language.save();
  
      res.status(201).json({
        message: "Lesson created successfully.",
        lesson: newLesson,
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "An error occurred while creating lesson." });
    }
  };
  
  // Update a specific lesson within a chapter and language
  const updateLesson = async (req, res) => {
    try {
      const { languageId, chapterId, lessonId } = req.params;
      const { name } = req.body;
  
      const language = await Language.findById(languageId);
      if (!language) {
        return res.status(404).json({ message: "Language not found." });
      }
  
      const chapter = Array.from(language.chapters.values()).find(
        (ch) => ch._id === chapterId
      );
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found." });
      }
  
      const lesson = Array.from(chapter.lessons.values()).find(
        (l) => l._id === lessonId
      );
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }
  
      // Check if the new name is already in use by another lesson
      const existingLesson = Array.from(chapter.lessons.values()).find(
        (l) => l.name === name
      );
      if (existingLesson && existingLesson._id !== lessonId) {
        return res.status(400).json({ message: "A lesson with that name already exists." });
      }
  
      chapter.lessons.delete(lesson.name);
      lesson.name = name;
      chapter.lessons.set(name, lesson);
  
      await language.save(); // Save the updated chapter
  
      res.status(200).json({
        message: "Lesson updated successfully.",
        lesson,
      });
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: "An error occurred while updating lesson." });
    }
  };


  // Delete a specific lesson within a chapter and language
  const deleteLesson = async (req, res) => {
    try {
      const { languageId, chapterId, lessonId } = req.params;
  
      const language = await Language.findById(languageId);
      if (!language) {
        return res.status(404).json({ message: "Language not found." });
      }
  
      const chapter = Array.from(language.chapters.values()).find(
        (ch) => ch._id === chapterId
      );
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found." });
      }
  
      const lesson = Array.from(chapter.lessons.values()).find(
        (l) => l._id === lessonId
      );
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }
  
      chapter.lessons.delete(lesson.name);
  
      await language.save();
  
      res.status(200).json({
        message: "Lesson deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ message: "An error occurred while deleting lesson." });
    }
  };


module.exports = { createLesson, updateLesson, deleteLesson };
