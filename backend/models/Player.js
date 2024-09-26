const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = new Schema({
  name: { type: String, required: true },
  ranchName: { type: String, required: true },
  coins: { type: Number, default: 1000 },
  inventory: { type: Array, default: [] },
  ranchLocation: { type: String, default: "grassLand" },
  monsters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monster', // Assuming you have a Monster schema/model
    }
  ]
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
