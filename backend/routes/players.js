const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const playerController = require('../controllers/playerController');

// POST route to create a new player
router.post('/create', playerController.createPlayer);

// Route to get a player's data by ID
router.get('/:id', playerController.getPlayer);

// Route to load the saved player data
router.get('/load', async (req, res) => {
    try {
      const savedPlayer = await Player.findOne(); // Adjust the query to load the correct player
      if (savedPlayer) {
        res.json(savedPlayer);
      } else {
        res.status(404).json({ error: 'No saved game found' });
      }
    } catch (error) {
      console.error('Error loading player:', error);
      res.status(500).json({ error: 'Failed to load saved game' });
    }
  });

// Route to update player data
// routes/playerRoutes.js
router.post('/autosave', async (req, res) => {
  const { playerId, playerData } = req.body;
  console.log('Received autosave data:', playerData);

  try {
    // Prepare the update data using $set to update only specified fields
    const updateData = {};

    if ('name' in playerData) updateData.name = playerData.name;
    if ('ranchName' in playerData) updateData.ranchName = playerData.ranchName;
    if ('coins' in playerData) updateData.coins = playerData.coins;
    if ('inventory' in playerData) updateData.inventory = playerData.inventory;
    if ('monsters' in playerData) updateData.monsters = playerData.monsters;
    if ('ranchLocation' in playerData) updateData.ranchLocation = playerData.ranchLocation;
    if (playerData.activeMonster) {
      updateData.activeMonster = mongoose.Types.ObjectId(playerData.activeMonster);
    }

    // Update the player document using $set
    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ message: 'Player data autosaved successfully', player: updatedPlayer });
  } catch (error) {
    console.error('Error saving player data:', error);
    res.status(500).json({ error: 'Failed to autosave player data' });
  }
});



module.exports = router;
