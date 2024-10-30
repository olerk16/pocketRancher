// controllers/monsterController.js
const axios = require('axios');
const sharp = require('sharp'); // For image manipulation
const Monster = require('../models/Monster'); // Import the Monster model
const { removeWhiteBackgroundFromBuffer } = require('../utils/imageUtils'); // Import utility
const { v4: uuidv4 } = require('uuid'); // Import UUID

const APIkey = process.env.OPENAI_API_KEY; // Use environment variable for API key

exports.generateMonster = async (req, res) => {
    console.log('Received request to generate monster');
    try {
        const prompt = "A towering, predatory grasslands monster with long limbs, sharp claws, and glowing green eyes. Its muscular body is covered in scaly, grass-colored skin, allowing it to camouflage in the plains. The creature has a pair of curved horns and a gaping mouth full of jagged teeth. Menacing and ready to pounce, it stands against a white background.";

        // Generate the monster image using DALL·E 3 model
        const imageData = {
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        };

        const headers = {
            'Authorization': `Bearer ${APIkey}`,
            'Content-Type': 'application/json',
        };

        // Request image generation from OpenAI
        const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', imageData, { headers });
        const monsterImageUrl = imageResponse.data.data[0].url;

        // Generate random stats for the monster
        const randomStats = {
            hunger: Math.floor(Math.random() * 100),
            happiness: Math.floor(Math.random() * 100),
            energy: Math.floor(Math.random() * 100),
            hygiene: Math.floor(Math.random() * 100),
            lifeSpan: Math.floor(Math.random() * 100)
        };

        // Download the image
        const imageResponseBuffer = await axios.get(monsterImageUrl, { responseType: 'arraybuffer' });
        const inputBuffer = Buffer.from(imageResponseBuffer.data);

        // Remove white background
        const processedImageBuffer = await removeWhiteBackgroundFromBuffer(inputBuffer);

        // Convert the image to Base64 (more efficient for MongoDB storage)
        const processedImageBase64 = processedImageBuffer.toString('base64');

        // Generate a unique key for the monster
        const uniqueKey = uuidv4(); // Generate a UUID

        // Create a new monster and save it to MongoDB
        const newMonster = new Monster({
            name: 'Random Monster', // You can modify or randomize this
            favoriteFood: 'Magic Berries',
            imageUrl: processedImageBase64, // Store image data
            stats: randomStats,
            uniqueKey: uniqueKey // Save the unique key
        });

        // Save to database
        await newMonster.save();

        // Return image as response
        // res.setHeader('Content-Type', 'image/png');
        // res.send(processedImage);
        // Send the response as JSON
    res.json({
        name: newMonster.name,
        favoriteFood: newMonster.favoriteFood,
        stats: randomStats,
        imageUrl: `data:image/png;base64,${processedImageBase64}`, // Return the Base64 image string,
        uniqueKey: uniqueKey // Send the unique key
      });

    } catch (error) {
        console.error('Error generating monster image:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error generating the monster image.' });
    }
};

exports.getMonsterByType = async (req, res) => {
    console.log("getting monster", req.body)
    try {
      const { type } = req.params;
      const monster = await Monster.findOne({ type });
  
      if (!monster) {
        return res.status(404).json({ error: 'Monster not found' });
      }
  
      res.json(monster);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
