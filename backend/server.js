require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const monsterRoutes = require('./routes/monsters');
const playerRoutes = require('./routes/players');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the data/Assets directory
app.use('/backend/data/Assets', express.static(path.join(__dirname, 'data', 'Assets')));

// Routes
app.use('/api/monsters', monsterRoutes);
app.use('/api/players', playerRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
