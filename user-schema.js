const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    require: true
  },
  lastname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  birthdate: {
    type: Date,
    require: true
  },
  gender: {
    type: String,
    require: true
  }
})

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;