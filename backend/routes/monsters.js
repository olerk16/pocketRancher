const express = require('express');
const router = express.Router();
const Monster = require('../models/Monster');
// const { generateMonster } = require('../controllers/monsterController');
const monsterController = require('../controllers/monsterController');

// Move the generate-monster route to the top for clarity
router.post('/generate-monster', monsterController.generateMonster);

// Route to create a new monster
router.post('/create', async (req, res) => {
  const { name, favoriteFood, hunger, happiness, energy, hygiene, lifeSpan, imageUrl } = req.body;
  const newMonster = new Monster({ name, favoriteFood, hunger, happiness, energy, hygiene, lifeSpan, imageUrl });

  try {
    const savedMonster = await newMonster.save();
    res.json(savedMonster);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get a monster by type
router.get('/monsters/:type', monsterController.getMonsterByType);

// Route to get all monsters
router.get('/', async (req, res) => {
  try {
    const monsters = await Monster.find();
    res.json(monsters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a specific monster by ID
router.get('/:id', async (req, res) => {
  try {
    const monster = await Monster.findById(req.params.id);
    if (!monster) return res.status(404).json({ message: 'Monster not found' });
    res.json(monster);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update a monster
router.put('/:id', async (req, res) => {
  try {
    const updatedMonster = await Monster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMonster) return res.status(404).json({ message: 'Monster not found' });
    res.json(updatedMonster);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to delete a monster
router.delete('/:id', async (req, res) => {
  try {
    const monster = await Monster.findByIdAndDelete(req.params.id);
    if (!monster) return res.status(404).json({ message: 'Monster not found' });
    res.json({ message: 'Monster deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
