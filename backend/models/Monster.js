const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    favoriteFood: { type: String, required: true },
    imageURL: { type: String, required: true }, // Storing the S3 URL as a string
    initialStats: {
      hunger: { type: Number, required: true },
      happiness: { type: Number, required: true },
      energy: { type: Number, required: true },
      hygiene: { type: Number, required: true },
      lifeSpan: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now }, 
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster;
