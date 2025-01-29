const mongoose = require('mongoose'); 
const Player = require('../models/Player');
const Monster = require('../models/Monster');

// Create new player
exports.createPlayer = async (req, res) => {
    try {
        const { name, ranchName, ranchLocation } = req.body;

        // Create player with basic starting data
        const playerData = {
            name,
            ranchName,
            coins: 100,
            inventory: [],
            monsters: [],
            activeMonster: null,
            ranchLocation: ranchLocation || 'grassLand', // Set default if not provided
            hasSeenWelcome: false
        };

        const player = new Player(playerData);
        const savedPlayer = await player.save();

        // Send the complete player object including _id
        res.status(201).json({
            _id: savedPlayer._id,
            name: savedPlayer.name,
            ranchName: savedPlayer.ranchName,
            coins: savedPlayer.coins,
            inventory: savedPlayer.inventory,
            monsters: savedPlayer.monsters,
            activeMonster: savedPlayer.activeMonster,
            ranchLocation: savedPlayer.ranchLocation,
            hasSeenWelcome: savedPlayer.hasSeenWelcome
        });

    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({ 
            message: 'Error creating player',
            error: error.message 
        });
    }
};

// Get player by ID
exports.getPlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching player' });
    }
};

// Update player
exports.updatePlayer = async (req, res) => {
    try {
        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating player' });
    }
};

// Delete player
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting player' });
    }
};
