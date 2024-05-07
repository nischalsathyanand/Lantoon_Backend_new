const Language = require("../models/course");


//Create Qusetion within a lesson
const createQuestion = async (req, res) => {
    try {
      const { languageId, chapterId, lessonId } = req.params;
      const { question_type, text, image1, image2, audio1, audio2, answerText } = req.body;
     
  
      if (!question_type || !text) {
        return res.status(400).json({ message: "Question type and text are required." });
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
  
      const lesson = Array.from(chapter.lessons.values()).find(
        (l) => l._id === lessonId
      );
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }
  
     
  
      const newQuestion = {
       
        order_id: lesson.questions.length + 1, // Order based on current length of questions
        question_type,
        text,
        image1,
        image2,
        audio1,
        audio2,
        answerText,
      };
  
      lesson.questions.push(newQuestion);
  
      await language.save(); // Save the changes to the language
  
      res.status(201).json({
        message: "Question created successfully.",
        question: newQuestion,
      });
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "An error occurred while creating question." });
    }
  };
//Update Questions with in a lesson
const updateQuestion = async (req, res) => {
    try {
      const { languageId, chapterId, lessonId, orderId } = req.params;
      const { question_type, text, image1, image2, audio1, audio2, answerText } = req.body;
  
      // Validate required parameters
      if (!languageId || !chapterId || !lessonId || !orderId) {
        return res.status(400).json({ message: "Missing required parameters." });
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
  
      const lesson = Array.from(chapter.lessons.values()).find(
        (l) => l._id === lessonId
      );
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }
  
      // Find the question with the given order_id
      const question = lesson.questions.find(
        (q) => q.order_id === parseInt(orderId, 10)
      );
  
      if (!question) {
        return res.status(404).json({ message: "Question not found." });
      }
  
      // Update the question properties with new data from req.body
      question.question_type = question_type || question.question_type;
      question.text = text || question.text;
      question.image1 = image1 || question.image1;
      question.image2 = image2 || question.image2;
      question.audio1 = audio1 || question.audio1;
      question.audio2 = audio2 || question.audio2;
      question.answerText = answerText || question.answerText;
  
      // Save the updated Language document
      await language.save();
  
      res.status(200).json({
        message: "Question updated successfully.",
        question,
      });
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "An error occurred while updating the question." });
    }
  };
  
//Delete Question within a lesson
const deleteQuestion = async (req, res) => {
    try {
      const { languageId, chapterId, lessonId, orderId } = req.params;
  
      // Validate required parameters
      if (!languageId || !chapterId || !lessonId || !orderId) {
        return res.status(400).json({ message: "Missing required parameters." });
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
  
      const lesson = Array.from(chapter.lessons.values()).find(
        (l) => l._id === lessonId
      );
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }
  
      // Find the question with the given order_id
      const questionIndex = lesson.questions.findIndex(
        (q) => q.order_id === parseInt(orderId, 10)
      );
  
      if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found." });
      }
  
      // Remove the question from the array
      lesson.questions.splice(questionIndex, 1);
  
      // Save the updated Language document
      await language.save();
  
      res.status(200).json({
        message: "Question deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "An error occurred while deleting the question." });
    }
  };
  
module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
