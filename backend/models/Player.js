const mongoose = require('mongoose');
const { Schema } = mongoose;
const Monster = require('../models/Monster');


const playerSchema = new Schema({
  name: { type: String, required: true },
  ranchName: { type: String, required: true },
  coins: { type: Number, default: 1000 },
  inventory: { type: Array, default: [] },
  ranchLocation: { type: String, default: "grassLand" },
  monsters: [{ type: Schema.Types.ObjectId, ref: 'Monster' }], // Referencing Monster model
  activeMonster: { type: Schema.Types.ObjectId, ref: 'Monster' }, // Reference to active monster
  frozenMonsters: [{ type: Schema.Types.ObjectId, ref: 'Monster' }] 


});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
