const axios = require('axios');
require('dotenv').config();

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

module.exports = {
    openaiAxios,
    CONFIG
}; 