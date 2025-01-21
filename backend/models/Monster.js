const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    favoriteFood: { type: String },
    imageURL: { type: String },
    initialStats: {
      hunger: { type: Number, default: 80 },
      happiness: { type: Number, default: 70 },
      energy: { type: Number, default: 90 },
      hygiene: { type: Number, default: 60 },
      lifeSpan: { type: Number, default: 100 }
    },
    currentStats: {
      hunger: { type: Number },
      happiness: { type: Number },
      energy: { type: Number },
      hygiene: { type: Number },
      lifeSpan: { type: Number }
    },
    isFrozen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, 
});

// Pre-save middleware to ensure currentStats are set
monsterSchema.pre('save', function(next) {
  if (!this.currentStats || Object.keys(this.currentStats).length === 0) {
    this.currentStats = { ...this.initialStats };
  }
  next();
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster;
