require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

console.log("helllooooooooooooooo",process.env.MONGO_URI)

// Middleware to parse JSON
app.use(express.json());

// Import routes
const monsterRoutes = require('./routes/monsters');

// Routes
app.use('/monsters', monsterRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
