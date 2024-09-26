const Player = require('../models/Player');

exports.createPlayer = async (req, res) => {
  try {
    const { name, ranchName, coins, inventory, ranchLocation, monsters } = req.body;

    // Create new player instance
    const newPlayer = new Player({
      name,
      ranchName,
      coins,
      inventory,
      ranchLocation,
      monsters
    });

    // Save the player to MongoDB
    await newPlayer.save();
    res.status(201).json({ success: true, data: newPlayer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
