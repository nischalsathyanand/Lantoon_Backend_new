const Language = require("../models/course");
const generateId = require("../utils/genarateId");

// Create a new language
const createLanguage = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Language name is required." });
    }

    // Check if a language with the same name already exists
    const existingLanguage = await Language.findOne({ name });

    if (existingLanguage) {
      return res
        .status(409)
        .json({ message: "Language with this name already exists." });
    }

    const _id = generateId();

    const newLanguage = new Language({ _id, name });
    const savedLanguage = await newLanguage.save();

    res.status(201).json({
      message: "Language created successfully.",
      language: savedLanguage,
    });
  } catch (error) {
    console.error("Error creating language:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating language." });
  }
};

// Update a specific chapter in a language
const updateLanguage= async (req, res) => {
  try {
    const { languageId } = req.params;
    const { name } = req.body;

    const updatedLanguage = await Language.findByIdAndUpdate(
      languageId,
      { name },
      { new: true }
    );

    if (!updatedLanguage) {
      return res.status(404).json({ message: "Language not found." });
    }

    res.status(200).json({
      message: "Language updated successfully.",
      language: updatedLanguage,
    });
  } catch (error) {
    console.error("Error updating language:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating language." });
  }
};

// Delete a specific chapter from a language
const deleteLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;

    const deletedLanguage = await Language.findByIdAndDelete(languageId);

    if (!deletedLanguage) {
      return res.status(404).json({ message: "Language not found." });
    }

    res.status(200).json({
      message: "Language deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting language:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting language." });
  }
};

module.exports = {
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
