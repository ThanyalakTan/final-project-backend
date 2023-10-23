const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  activityType: {
    type: String,
    require: true
  },
  activityName: {
    type: String,
    require: true
  },
  duration: {
    type: Number,
    require: true
  },
  distance: {
    type: Number,
    require: false
  },
  deadline: {
    type: Date,
    require: true
  },
  userId: {
    type: String,
    require: true
  },
  status: {
    type: String,
    require: true
  }
})

const GoalModel = mongoose.model('Goal', GoalSchema);
module.exports = GoalModel;