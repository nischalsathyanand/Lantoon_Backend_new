const mongoose = require("mongoose");

// Question Schema
const questionSchema = new mongoose.Schema({
  order_id: { type: Number, required: true },
  question_type: { type: String, required: true },
  text: { type: String, required: true },
  image1: { type: String },
  image2: { type: String },
  audio1: { type: String },
  audio2: { type: String },
  answerText: { type: String },
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  questions: [questionSchema], // Array of questions
});

// Chapter Schema
const chapterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  lessons: {
    type: Map,
    of: lessonSchema,
    default: new Map(), // Ensure lessons are initialized as a Map
  },
});

// Language Schema
const languageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  chapters: {
    type: Map,
    of: chapterSchema,
    default: new Map(), // Ensure chapters are initialized as a Map
  },
});

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;
