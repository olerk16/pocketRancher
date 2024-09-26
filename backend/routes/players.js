const express = require('express');
const router = express.Router();
const { createPlayer } = require('../controllers/playerController');

// POST route to create a new player
router.post('/create', createPlayer);

module.exports = router;
