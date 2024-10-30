require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION  // e.g., 'us-east-1'
});

// Import routes
const monsterRoutes = require('./routes/monsters');
const playerRoutes = require('./routes/players');

const app = express();
app.use(cors());
app.use(express.json());

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
