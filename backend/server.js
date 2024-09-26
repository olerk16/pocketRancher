require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const monsterRoutes = require('./routes/monsters');
const playerRoutes = require('./routes/players');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/monsters', monsterRoutes);
app.use('/players', playerRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
