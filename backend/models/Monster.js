const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    favoriteFood: { type: String, required: true },
    imageUrl: { type: Buffer, required: true }, // Storing image as buffer
    stats: {
      hunger: { type: Number, required: true },
      happiness: { type: Number, required: true },
      energy: { type: Number, required: true },
      hygiene: { type: Number, required: true },
      lifeSpan: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now }, // Auto-generated date
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster;
