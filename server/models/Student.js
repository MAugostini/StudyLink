// server/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Fname: { type: String, required: true },
  Lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // removed unique
  school: { type: String, required: true },
  major: { type: String, required: true },
  schoolYear: { type: Number, enum: [1, 2, 3, 4], required: true },
  courses: [{ type: String }],
  availability: { days: [String], time: [String] },
  preferences: { studyStyle: [String], groupSize: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema, "Student");
