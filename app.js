const express = require('express');
const app = express();
const port = 8100;

const UserModel = require('./user-schema');   // Import userModel from user-schema.js
const mongoose = require('mongoose');   // Import mongoose
const ActivityModel = require('./activity-schema'); // Import ActivityModel from activity-schema.js

// Connect mongoose to MongoDB Atlas
mongoose.connect('mongodb+srv://thanyalak15601:1wln2TKZjsElgrXb@cluster0.uta1bz1.mongodb.net/?retryWrites=true&w=majority')

// create app.use(express.json()); for used to parse incoming JSON data from HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create route Signup
app.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password, rePassword, birthdate, gender } = req.body;   // get value from body
  if(firstname && lastname && email && password && rePassword && birthdate && gender) {
    if(password !== rePassword) {
      res.status(400).json(`Passwords did not match`);
    }
    const findUser = await UserModel.findOne({ email });
    console.log('findUser => ', findUser);
    if(findUser){
      return res.status(400).json('Sorry, email already exits')
    }
    const userData = await UserModel.create({ firstname, lastname, email, password, birthdate, gender })
    console.log(`Form Succesfully Submitted`)
    return res.status(200).json(userData);
    } else {
      res.status(400).json(`Please fill empty form`);
    }
})

// Create route Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if(email && password) {
    const findUserLogin = await UserModel.find({ email, password })
    console.log("findUserLogin => ", findUserLogin)
    if(findUserLogin.length > 0) {
      res.status(200).json('Already a member, please login');
    } else {
      res.status(200).json('Email or password incorrect!')
    }
  } else {
    res.status(400).json(`Please input your email or password`)
  }
})

// Create route for Create Activity
app.post('/createactivity', (req, res) => {
  const { activityType, activityName, description, duration, date } = req.body;
  if (activityType && activityName && duration && date) {
    const userActivity = ActivityModel.create({ activityType, activityName, description, duration, date });
    console.log('Create activity success')
    res.status(200).json(userActivity);
  } else {
    res.status(400).json('Please fill required form: Activity Type, Activity Name, Duration, and Date')
  }
})

// Run on port 3000
app.listen(port, () => {
  console.log(`Start on port ${port}`);
})