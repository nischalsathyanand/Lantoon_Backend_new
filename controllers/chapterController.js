const Language = require("../models/course");
// Create a new chapter within a specific language
const createChapter = async (req, res) => {
    try {
      const { languageId } = req.params; // Assuming languageId comes from route parameters
      const { chapterId, name } = req.body; // Expecting a unique chapterId and name
  
      if (!name) {
        return res.status(400).json({ message: "Chapter name is required." });
      }
  
      if (!chapterId) {
        return res.status(400).json({ message: "Chapter ID is required." });
      }
  
      // Find the language by ID
      const language = await Language.findById(languageId);
  
      if (!language) {
        return res.status(404).json({ message: "Language not found." });
      }
  
      // Ensure `chapters` is a Map; initialize if necessary
      if (!language.chapters || typeof language.chapters.set !== 'function') {
        language.chapters = new Map(); // Initialize as a Map
      }
  
      // Create the new chapter with a valid chapterId
      const newChapter = {
        _id: chapterId, // Use provided chapterId
        name,
        lessons: new Map(), // Initialize with an empty Map for lessons
      };
  
      // Add the new chapter to the chapters map with a unique key
      language.chapters.set(String(chapterId), newChapter); // Ensure key is a string
  
      await language.save(); // Save the updated language
  
      res.status(201).json({
        message: "Chapter created successfully.",
        chapter: newChapter,
      });
    } catch (error) {
      console.error("Error creating chapter:", error);
      res.status(500).json({ message: "An error occurred while creating chapter." });
    }
  };
  
  


//update
const updateChapterById = async (req, res) => {};

// Delete a specific chapter by its ID within a specific language
const deleteChapterById = async (req, res) => {};
module.exports = { createChapter, updateChapterById, deleteChapterById };
