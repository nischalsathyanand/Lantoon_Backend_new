const Language = require("../models/course");

const createChapter = async (req, res) => {
  const { languageId } = req.params;
  const chapterData = req.body;

  if (!chapterData._id || !chapterData.name) {
    return res
      .status(400)
      .json({
        message:
          "Both '_id' and 'name' are required fields for creating a chapter.",
      });
  }

  try {
    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found" });
    }

    const existingChapterById = language.chapters.find(
      (ch) => ch._id === chapterData._id
    );
    const existingChapterByName = language.chapters.find(
      (ch) => ch.name === chapterData.name
    );

    if (existingChapterById) {
      return res
        .status(409)
        .json({
          message: `Chapter with ID ${chapterData._id} already exists.`,
        });
    }

    if (existingChapterByName) {
      return res
        .status(409)
        .json({
          message: `Chapter with name ${chapterData.name} already exists.`,
        });
    }

    language.chapters.push(chapterData);
    await language.save();

    const newChapter = language.chapters[language.chapters.length - 1];

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getChapterById = async (req, res) => {
  const { languageId, chapterId } = req.params;

  try {
    const language = await Language.findById(languageId);

    if (!language) {
      return res.status(404).json({ message: "Language not found" });
    }

    const chapter = language.chapters.find((ch) => ch._id === chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.error("Error fetching chapter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//update
const updateChapterById = async (req, res) => {
    const { languageId, chapterId } = req.params; 
    const updatedData = req.body; 
  
    try {
      // Find the language by its ID
      const language = await Language.findById(languageId);
      
      if (!language) {
        return res.status(404).json({ message: "Language not found" }); // If the language doesn't exist
      }
  
      // Find the specific chapter by its ID within the language's chapters array
      const chapterIndex = language.chapters.findIndex((ch) => ch._id === chapterId);
  
      if (chapterIndex === -1) {
        return res.status(404).json({ message: "Chapter updated" });
      }
  
      // Update the chapter with the new data
      Object.assign(language.chapters[chapterIndex], updatedData); // Assign new values to the existing chapter
      await language.save(); // Save the updated Language document
      
      // Return the updated chapter with status 200
      res.status(200).json(language.chapters[chapterIndex]);
    } catch (error) {
      console.error("Error updating chapter:", error); // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error" }); // Return a server error response
    }
  };



  // Delete a specific chapter by its ID within a specific language
const deleteChapterById = async (req, res) => {
    const { languageId, chapterId } = req.params; // Extract the language and chapter IDs from URL parameters
    
    try {
      // Find the language by its ID
      const language = await Language.findById(languageId);
      
      if (!language) {
        return res.status(404).json({ message: "Language not found" }); // If the language doesn't exist
      }
  
      // Find the specific chapter by its ID within the language's chapters array
      const chapterIndex = language.chapters.findIndex((ch) => ch._id === chapterId);
      
      if (chapterIndex === -1) {
        return res.status(404).json({ message: "Chapter not found" }); // If the chapter doesn't exist
      }
  
      // Remove the chapter from the chapters array
      language.chapters.splice(chapterIndex, 1); // Remove one item from the specified index
      await language.save(); // Save the updated Language document
      
      // Return a success message with status 200
      res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
      console.error("Error deleting chapter:", error); // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error" }); // Return a generic error response
    }
  };
module.exports = { createChapter, getChapterById,updateChapterById ,deleteChapterById};
