const mongoose = require('mongoose'); 
const Player = require('../models/Player');
const Monster = require('../models/Monster');

exports.createPlayer = async (req, res) => {
  console.log("Incoming Player Data:", req.body);
  try {
    const { name, ranchName, coins, inventory, ranchLocation, deceasedMonsters } = req.body;

    // Find or create the default 'shadowHound' monster
    let shadowHound = await Monster.findOne({ type: 'shadowHound' });

    if (!shadowHound) {
      shadowHound = new Monster({
        name: 'Shadow Hound',
        type: 'shadowHound',
        favoriteFood: 'Magic Berries',
        imageURL: 'https://path-to-s3-image/shadowHound.png',
        initialStats: {
          hunger: 80,
          happiness: 70,
          energy: 90,
          hygiene: 60,
          lifeSpan: 100,
        },
        currentStats: {  // Add currentStats explicitly
          hunger: 80,
          happiness: 70,
          energy: 90,
          hygiene: 60,
          lifeSpan: 100,
        }
      });
      await shadowHound.save();
    }

    // Clone the shadowHound but preserve any existing stats
    const playerMonster = new Monster({
      ...shadowHound.toObject(),
      _id: new mongoose.Types.ObjectId(),
      currentStats: shadowHound.currentStats || shadowHound.initialStats  // Preserve current stats
    });
    await playerMonster.save();

    const newPlayer = new Player({
      name,
      ranchName,
      coins: coins || 1000,
      inventory: inventory || [],
      ranchLocation: ranchLocation || 'grassLand',
      monsters: [playerMonster._id],
      activeMonster: playerMonster._id,
      deceasedMonsters: deceasedMonsters || []
    });

    await newPlayer.save();

    // Populate the player data with full monster details
    const populatedPlayer = await Player.findById(newPlayer._id)
      .populate({
        path: 'activeMonster',
        select: '-__v',  // Exclude version key
        model: 'Monster'
      })
      .exec();

    console.log("Populated Player Data:", populatedPlayer);

    res.status(201).json({ success: true, data: populatedPlayer });
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// controllers/playerController.js
exports.getPlayer = async (req, res) => {
  try {
    const playerId = req.params.id;

    // Validate playerId
    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    // Find the player by ID and populate the activeMonster with full data
    const player = await Player.findById(playerId)
      .populate('activeMonster') // Populate activeMonster
      .exec();

    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });

    }

    console.log('Fetched player:', player);


    res.json({ success: true, data: player });
  } catch (error) {
    console.error("Error fetching player data:", error);
    res.status(500).json({ success: false, error: 'Failed to load player data' });
  }
};
