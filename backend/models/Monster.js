const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
  name: String,
  favoriteFood: String,
  imageUrl: String, // URL for the monster image
  diseases: [String],  // List of diseases a monster has
  stats: {
      hunger: Number,
      happiness: Number,
      energy: Number,
      hygiene: Number,
      lifeSpan: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster;
