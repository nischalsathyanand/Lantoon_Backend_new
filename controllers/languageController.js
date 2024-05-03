const Languages=require("../models/course")
const mongoose = require('mongoose');
// Function to Create a New Language
const createLanguage = async (req, res) => {
  try {
    // Validate the request body to ensure it contains necessary fields
    if (!req.body.name) {
      return res.status(400).json({ message: "Language name is required" });
    }

    // Check if the language already exists to avoid duplicates
    const existingLanguage = await Languages.findOne({ name: req.body.name });
    if (existingLanguage) {
      return res.status(409).json({ message: "Language already exists" });
    }

    // Create a new language instance with the provided data
    const newLanguage = new Languages({
      _id: new mongoose.Types.ObjectId(), // Ensure a unique ID
      name: req.body.name,
    });

    // Save the new language to the database
    await newLanguage.save();

    // Return a success response with the created language
    res.status(201).json(newLanguage);
  } catch (error) {
    console.error("Error creating new language:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// read
const getLanguageById = async (req, res) => {
    const { languageId } = req.params; 
  
    try {
      const language = await Languages.findById(languageId); 
      console.log(language)
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
  
      res.status(200).json(language); 
    } catch (error) {
      console.error("Error fetching language:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Update a language by ID
  const updateLanguageById = async (req, res) => {
    try {
        const language = await Languages.findByIdAndUpdate(req.params.languageId, req.body, { new: true });
        if (!language) {
          return res.status(404).json({ message: 'Language not found' });
        }
        res.json(language);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    
  };
  
  // Delete a language by ID
  const deleteLanguageById = async (req, res) => {
    try {
        const language = await Languages.findByIdAndDelete(req.params.languageId);
        if (!language) {
          return res.status(404).json({ message: 'Language not found' });
        }
        res.json({ message: 'Language deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message});
    }
    
  };
  
module.exports={createLanguage,getLanguageById,updateLanguageById,deleteLanguageById}