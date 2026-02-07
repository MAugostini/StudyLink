const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Fname: {
    type: String,
    required: true
  },

  Lname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    unique: true
  },

  school: {
    type: String,
    required: true
  },

  major: {
    type: String,
    required: true
  },

  schoolYear: {
    type: Number,
    enum: [1, 2, 3, 4], // 1: Freshman, 2: Sophomore, 3: Junior, 4: Senior
    required: true
  },

  courses: [
    {
      type: String,
    }
  ],

  availability: {
    days: [String],          // e.g. ["Mon", "Wed"]
    time: [String]             // e.g. "Evenings"
  },

  preferences: {
    studyStyle: [String],      // e.g. "inperson", "virtual", "hybrid"
    groupSize: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
