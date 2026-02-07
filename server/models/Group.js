const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true
  },

  LastName: {
    type: String,
    required: true
  },

  GroupName: {
    type: String,
    required: true,
    unique: true
  },

  GroupSize: {
    type: Number,
    required: true
  },

  CourseName: {
    type: String,
    required: true
  },

  MeetingTimes: {
    days: [String],          // e.g. ["Mon", "Wed"]
    time: [String]             // e.g. [8am, 10am]
  },

  MeetingPlace: {
    type: [String],            // e.g. ["Library", "Zoom"]
    required: true
  },
  
  SchoolName: {
    type: String,
    required: true
  },

  GroupDesc: {
    type: String,
  },

  GroupGoal: {
    type: String,
  },

  Attendance: {
    type: [String],            // e.g. ["John Doe", "Jane Smith"]
  }
});

module.exports = mongoose.model('Group', groupSchema);
