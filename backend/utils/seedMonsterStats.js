// utils/seedMonsters.js
require('dotenv').config(); // This loads variables from your .env file
const mongoose = require('mongoose');
const Monster = require('../models/Monster'); // Import the Monster model
const Monsters = require('../data/Monsters'); // Import the list of monsters from the frontend-like object

console.log("hellllloooooooooooo",Monsters);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));

  console.log(Monsters);

async function seedMonsters() {
  try {
    // Clear any existing monsters
    await Monster.deleteMany({});
    console.log('Old monsters removed');

    // Log the Monsters array to ensure it's correctly formatted
    console.log('Monsters data being inserted:', Monsters);

    // Insert new monsters
    await Monster.insertMany(Monsters);
    console.log('Monster data successfully seeded');

  } catch (error) {
    console.error('Error seeding monsters:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Call the seed function
seedMonsters();
