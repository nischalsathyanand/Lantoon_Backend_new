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
  questions: [questionSchema],
});

const chapterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  lessons: [lessonSchema],
});

const languageSchema = new mongoose.Schema({
   
  name: { type: String, required: true },
  chapters: [chapterSchema],
});

const Language = mongoose.model('Language', languageSchema);

module.exports=Language;