const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const questions = require('./questions');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  proficiency: {
    cpp: { type: Number, default: 0 },
    java: { type: Number, default: 0 },
    python: { type: Number, default: 0 },
  },
  pastQuizzes: [{ category: String, score: Number, date: Date }],
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// User registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Save quiz result
app.post('/quiz', async (req, res) => {
  try {
    const { userId, category, score } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment proficiency level based on the current score
    user.proficiency[category] = Math.max(user.proficiency[category], score);

    // Update past quizzes
    user.pastQuizzes.push({ category, score, date: new Date() });

    await user.save();

    res.json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/questions', (req, res) => {
  const { category } = req.query;

  if (questions[category]) {
    res.json(questions[category]);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

app.get('/past-scores', async (req, res) => {
  try {
    const { userId } = req.query;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the past quiz scores for the user
    res.json(user.pastQuizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/quiz', async (req, res) => {
  try {
    const { userId, category, score } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's proficiency and add the quiz result to pastQuizzes
    user.proficiency[category] = Math.max(user.proficiency[category], score);
    user.pastQuizzes.push({ category, score, date: new Date() });

    // Save the updated user
    await user.save();

    res.json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new route for fetching language proficiency levels
app.get('/proficiency-levels', async (req, res) => {
  try {
    const { userId } = req.query;

    // Retrieve the user based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the proficiency levels stored in the user object
    res.json(user.proficiency);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
