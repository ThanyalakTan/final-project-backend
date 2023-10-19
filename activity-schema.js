const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  activityType: {
    type: String,
    require: true
  },
  activityName: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: false
  },
  duration: {
    type: Number,
    require: true
  },
  distance: {
    type: Number,
    require: false
  },
  date: {
    type: Date,
    require: true
  },
  userId: {
    type: String,
    require: true
  }
})

const ActivityModel = mongoose.model('Activity', ActivitySchema);
module.exports = ActivityModel;