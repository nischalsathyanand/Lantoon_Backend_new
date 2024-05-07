const Language = require("../models/course");
const generateId = require("../utils/genarateId");

// Create a new chapter within a specific language
const createChapter = async (req, res) => {
  try {
    const { languageId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Chapter name is required." });
    }

    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    if (language.chapters && language.chapters.has(name)) {
      return res.status(400).json({ message: "Chapter name already exists." });
    }

    if (!language.chapters) {
      language.chapters = new Map();
    }

    const chapterId = generateId();

    const newChapter = {
      _id: chapterId,
      name,
      lessons: new Map(),
    };

    language.chapters.set(name, newChapter);

    await language.save();

    res.status(201).json({
      message: "Chapter created successfully.",
      chapter: newChapter,
    });
  } catch (error) {
    console.error("Error creating chapter:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating chapter." });
  }
};

//update

const updateChapter = async (req, res) => {
  try {
    const { languageId, chapterId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Chapter name is required." });
    }

    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found." });
    }

    // Find the chapter by ID
    const chapter = Array.from(language.chapters.values()).find(
      (ch) => ch._id === chapterId
    );

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found." });
    }

    // Check if the new name is already in use by another chapter
    const existingChapter = Array.from(language.chapters.values()).find(
      (ch) => ch.name === name
    );
    if (existingChapter && existingChapter._id !== chapterId) {
      return res
        .status(400)
        .json({ message: "A chapter with that name already exists." });
    }

    // Update the chapter name and maintain the ID
    language.chapters.delete(chapter.name);
    chapter.name = name;
    language.chapters.set(name, chapter);

    await language.save(); // Save the changes

    res.status(200).json({
      message: "Chapter updated successfully.",
      chapter,
    });
  } catch (error) {
    console.error("Error updating chapter:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating chapter." });
  }
};

// Delete a specific chapter by its ID within a specific language
const deleteChapter = async (req, res) => {
  try {
    const { languageId, chapterId } = req.params;

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

    language.chapters.delete(chapter.name);

    await language.save();

    res.status(200).json({
      message: "Chapter deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting chapter." });
  }
};
module.exports = { createChapter, updateChapter, deleteChapter };
