// controllers/monsterController.js
const axios = require('axios');
const Monster = require('../models/Monster'); // Import the Monster model
const { removeWhiteBackgroundFromBuffer } = require('../utils/imageUtils'); // Import utility
const { v4: uuidv4 } = require('uuid'); // Import UUID
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Configuration
const CONFIG = {
    OPENAI: {
        API_KEY: process.env.OPENAI_API_KEY,
        TIMEOUT: 30000,
        IMAGE_SIZE: "1024x1024",
        IMAGE_QUALITY: "hd",
        MODEL: "dall-e-3",
        CHAT_MODEL: "gpt-3.5-turbo"
    },
    DEFAULT_STATS: {
        BASE: 50,
        VARIANCE: 10
    },
    RARITY_BONUSES: {
        common: 0,
        rare: 10,
        legendary: 20,
        mythical: 30
    }
};

// Create an axios instance with custom config
const openaiAxios = axios.create({
    timeout: CONFIG.OPENAI.TIMEOUT,
    headers: {
        'Authorization': `Bearer ${CONFIG.OPENAI.API_KEY}`,
        'Content-Type': 'application/json',
    }
});

// Helper function to save image to filesystem
async function saveImageToLocal(imageBuffer, fileName) {
    const imagesDir = path.join(__dirname, '..', 'data', 'Assets', 'monsterImages');
    
    // Ensure the directory exists
    await fs.mkdir(imagesDir, { recursive: true });

    const filePath = path.join(imagesDir, fileName);
    await fs.writeFile(filePath, imageBuffer);
    
    // Return the relative path for storage in the database
    return `backend/data/Assets/monsterImages/${fileName}`;
}

// Helper function to convert name to filename-safe string
function sanitizeFileName(name) {
    // Convert to lowercase and replace spaces/special chars with underscores
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

async function processAndSaveImage(imageBuffer, monsterName) {
    try {
        console.log('Starting image processing pipeline...');
        
        // Process the image
        const processedBuffer = await removeWhiteBackgroundFromBuffer(imageBuffer);
        
        // Generate filename from monster name
        const safeFileName = sanitizeFileName(monsterName);
        const fileName = `${safeFileName}.png`;
        const savedImagePath = await saveImageToLocal(processedBuffer, fileName);
        
        console.log('Image processing and saving completed');
        return savedImagePath;
    } catch (error) {
        console.error('Error in image processing pipeline:', error);
        throw error;
    }
}

// Helper function to generate monster name
async function generateMonsterName(prompt) {
    try {
        const namePrompt = `Based on this description of a monster: "${prompt}", 
            generate a short, cute, and fitting name for the monster. 
            Return only the name, nothing else. The name should be 1-2 words maximum.`;

        const response = await openaiAxios.post('https://api.openai.com/v1/chat/completions', {
            model: CONFIG.OPENAI.CHAT_MODEL,
            messages: [{
                role: "user",
                content: namePrompt
            }],
            temperature: 0.7,
            max_tokens: 20
        });

        const name = response.data.choices[0].message.content.trim();
        return name;
    } catch (error) {
        console.error('Error generating monster name:', error);
        return `Monster ${Math.floor(Math.random() * 1000)}`;
    }
}

// Helper function to generate random stats based on rarity
function generateMonsterStats(baseStats = null) {
    const randomVariance = () => Math.floor(Math.random() * (CONFIG.DEFAULT_STATS.VARIANCE * 2)) - CONFIG.DEFAULT_STATS.VARIANCE;
    const base = CONFIG.DEFAULT_STATS.BASE;

    const baseValues = baseStats || {
        hungerBase: base,
        happinessBase: base,
        energyBase: base,
        hygieneBase: base,
        lifeSpanBase: base
    };

    return Object.entries(baseValues).reduce((stats, [key, value]) => {
        const statName = key.replace('Base', '');
        stats[statName] = Math.min(100, Math.max(0, value + randomVariance()));
        return stats;
    }, {});
}

// Main Controller Functions
exports.generateMonster = async (req, res) => {
    console.log('Generating monster with request:', req.body);
    
    try {
        const monsterData = await createMonsterFromRequest(req.body);
        res.json(monsterData);
    } catch (error) {
        console.error('Error in monster generation:', error);
        handleMonsterGenerationError(error, res);
    }
};

async function createMonsterFromRequest({ offering, offeringDetails }) {
    const uniqueKey = uuidv4();
    const prompt = offeringDetails?.prompt || getDefaultPrompt();
    const monsterName = await generateMonsterName(prompt);
    
    const stats = generateMonsterStats({
        ...getBaseStats(),
        ...getRarityBonus(offeringDetails?.rarity)
    });

    const imageUrl = await generateAndProcessImage(prompt, monsterName);
    
    const monster = await saveMonster({
        name: monsterName,
        type: 'generated',
        favoriteFood: 'Magic Berries',
        imageURL: imageUrl,
        initialStats: stats,
        currentStats: stats,
        uniqueKey,
        rarity: offeringDetails?.rarity || 'common',
        types: offeringDetails?.monsterTypes || ['normal']
    });

    return formatMonsterResponse(monster);
}

function getDefaultPrompt() {
    return "Create a cute monster that has fangs, fur and random other features. The monster should be centered and isolated on a pure white background. The image should be clear and detailed, with the monster taking up most of the frame.";
}

function getBaseStats() {
    const base = CONFIG.DEFAULT_STATS.BASE;
    return {
        hungerBase: base,
        happinessBase: base,
        energyBase: base,
        hygieneBase: base,
        lifeSpanBase: base
    };
}

function getRarityBonus(rarity) {
    const bonus = CONFIG.RARITY_BONUSES[rarity] || 0;
    return Object.keys(getBaseStats()).reduce((acc, key) => {
        acc[key] = CONFIG.DEFAULT_STATS.BASE + bonus;
        return acc;
    }, {});
}

async function generateAndProcessImage(prompt, monsterName) {
    try {
        const imageResponse = await openaiAxios.post(
            'https://api.openai.com/v1/images/generations',
            {
                model: CONFIG.OPENAI.MODEL,
                prompt,
                n: 1,
                size: CONFIG.OPENAI.IMAGE_SIZE,
                quality: CONFIG.OPENAI.IMAGE_QUALITY
            }
        );

        const imageUrl = imageResponse.data.data[0].url;
        const imageBuffer = await downloadImage(imageUrl);
        return await processAndSaveImage(imageBuffer, monsterName);
    } catch (error) {
        console.error('Error generating image:', error);
        return 'backend/data/Assets/monsterImages/shadowHound.png';
    }
}

async function downloadImage(url) {
    const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        timeout: 10000
    });
    return Buffer.from(response.data);
}

async function saveMonster(monsterData) {
    const monster = new Monster(monsterData);
    return await monster.save();
}

function formatMonsterResponse(monster) {
    return {
        name: monster.name,
        type: monster.type,
        favoriteFood: monster.favoriteFood,
        stats: monster.initialStats,
        imageUrl: monster.imageURL,
        uniqueKey: monster.uniqueKey,
        types: monster.types
    };
}

function handleMonsterGenerationError(error, res) {
    res.status(500).json({ 
        error: 'Error generating monster',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
}

// Other Controller Functions
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
