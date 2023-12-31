const express = require('express');
const app = express();
const port = 8100;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const cors = require('cors');
const UserModel = require('./user-schema');   // Import userModel from user-schema.js
const mongoose = require('mongoose');   // Import mongoose
const ActivityModel = require('./activity-schema'); // Import ActivityModel from activity-schema.js
const GoalModel = require('./goal-schema'); // Import GoalModel from goal-schema.js
const verifyAuth = require('./middleware/verify-token');

// Connect mongoose to MongoDB Atlas
mongoose.connect('mongodb+srv://thanyalak15601:1wln2TKZjsElgrXb@cluster0.uta1bz1.mongodb.net/?retryWrites=true&w=majority')

// create app.use(express.json()); for used to parse incoming JSON data from HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const salt = bcrypt.genSaltSync(10);

// Create route Signup when click Signup
app.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password, rePassword, height, weight, age, birthdate, gender } = req.body;   // get value from body
  console.log(firstname, lastname, email, password, rePassword, height, weight, age, birthdate, gender)
  try {
    if(firstname && lastname && email && password && rePassword && height && weight && age && birthdate && gender) {
      if(password !== rePassword) {
        return res.status(400).json(`Passwords did not match`);
      }
      const findUser = await UserModel.findOne({ email });
      if(findUser){
        return res.status(400).json('Sorry, email already exits')
      }
      const userData = await UserModel.create({ firstname, lastname, email, password:bcrypt.hashSync(password, salt), height, weight, age, birthdate, gender })
      return res.status(200).json(userData);
      } else {
        return res.status(400).json(`Please fill the empty form`);
      }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// Create route Login when click login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if(email && password) {
      const findUserLogin = await UserModel.findOne({ email })
      if(!findUserLogin) {
        return res.status(404).json('Email or password incorrect')
      }
      const comparePassword = bcrypt.compareSync(password, findUserLogin.password);
      if(comparePassword) {
        jwt.sign({findUserLogin, id: findUserLogin._id}, process.env.mySecret, {}, (err, token) => {
          return res.status(200).json({token});
        })
      } else {
          return res.status(400).json('Email or password incorrect')
        }
    } else {
      return res.status(400).json(`Please input your email or password`)
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// Create route when click Create Activities
app.post('/activity', verifyAuth, async (req, res) => {
  const { activityType, activityName, description, duration, distance, date } = req.body;
  const userId = req.userId;
  if (activityType && activityName && duration && date) {
    const userActivity = await ActivityModel.create({ activityType, activityName, description, duration, distance, date, userId });
    return res.status(200).json(userActivity);
  } else {
    return res.status(400).json('Please fill the required form: Activity Type, Activity Name, Duration, and Date');
  }
})

app.put('/profile', verifyAuth, async (req, res) => {
  const userId = req.userId;
  const { firstname, lastname, height, weight, age } = req.body;   // get value from body
  try {
    if( firstname && lastname && height && weight && age ) {
      const updateProfile = await UserModel.findByIdAndUpdate(userId, { firstname, lastname, height, weight, age }, {new:true})
      return res.status(200).json(updateProfile);
    } else {
      return res.status(400).json('Please fill the empty form')
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// update activities
app.put('/activity/:id', verifyAuth, async (req, res) => {
  const { activityName, description, duration, distance } = req.body;
  const userId = req.userId;
  const activityId = req.params.id;
  try {
    if( activityName && duration ) {
      const updateActivity = await ActivityModel.findOneAndUpdate({ _id: activityId, userId: userId }, 
      { activityName, description, duration, distance }, {new: true});
      return res.status(200).json(updateActivity);
    } else {
      return res.status(400).json('Please fill the required form: ActivityName and Duration');
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// Create route when click Create Goals
app.post('/goal', verifyAuth, async (req, res) => {
  const { activityType, activityName, duration, distance, deadline, status } = req.body;
  const userId = req.userId;
  try {
    if(activityType && activityName && duration && deadline) {
      const userGoal = await GoalModel.create({ activityType, activityName, duration, distance, deadline, userId, status });
      return res.status(200).json(userGoal);
    } else {
      return res.status(400).json('Please fill the require form: Activity Type, Activity Name, Duration, and Deadline');
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// update goals
app.put('/goal/:id', verifyAuth, async (req, res) => {
  const { activityType, activityName, duration, distance, deadline, status } = req.body;
  const userId = req.userId;
  const goalId = req.params.id;
  try {
    if( activityType && activityName && duration && deadline ) {
      const updateGoal = await GoalModel.findOneAndUpdate({ _id: goalId, userId: userId}, { activityType, activityName, duration, distance, deadline, status }, {new: true});
      return res.status(200).json(updateGoal);
    } else {
      return res.status(400).json('Please fill the require form: Activity Type, Activity Name, Duration, and Deadline');
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }

})

// read(get) the activities
app.get('/activity', verifyAuth, async (req, res) => {
  const userId = req.userId;
  try {
    const findActivity = await ActivityModel.find({userId})
    return res.status(200).json(findActivity);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }

})

// read(get) goals
app.get('/goal', verifyAuth, async (req, res) => {
  const userId = req.userId;
  try {
    const findGoal = await GoalModel.find({userId})
    return res.status(200).json(findGoal);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }

})

// delete activity
app.delete('/activity/:id', verifyAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const activityId = req.params.id;
    const deleteActivity = await ActivityModel.findByIdAndRemove({ _id: activityId, userId: userId });
    return res.status(200).json(deleteActivity);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// delete goal
app.delete('/goal/:id', verifyAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.id;
    const deleteGoal = await GoalModel.findByIdAndRemove({ _id: goalId, userId: userId });
    return res.status(200).json(deleteGoal);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

app.get('/profile', verifyAuth, async (req, res) => {
  const userId = req.userId;
  try {
    const getUser = await UserModel.findById(userId);
    return res.status(200).json(getUser);
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

// Run on port 3000
app.listen(port, () => {
  console.log(`Start on port ${port}`);
})