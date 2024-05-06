const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  order_id: { type: Number, required: true },
  question_type: { type: String, required: true },
  text: { type: String, required: true },
  image1: { type: String },
  image2: { type: String },
  audio1: { type: String },
  audio2: { type: String },
  answerText: { type: String },
});

const lessonSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  //description: { type: String }, // New optional field
  questions: {
    type: Map,
    of: questionSchema, // Storing questions in a map
  },
});

const chapterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
 // description: { type: String }, // New optional field
  lessons: {
    type: Map,
    of: lessonSchema, // Storing lessons in a map
  }
});

const languageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
 // created_at: { type: Date, default: Date.now }, // Track when it was created
  chapters: {
    type: Map,
    of: chapterSchema, // Storing chapters in a map
  },
});

const Language = mongoose.model('Language', languageSchema);


module.exports=Language;