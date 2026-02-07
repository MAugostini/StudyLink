const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

console.log('ENV FILE LOADED FROM:', path.resolve(__dirname, '.env'));
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const User = require('./models/User');

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: 'Registration successful' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
