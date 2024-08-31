require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sharp = require('sharp'); // Import Sharp

const app = express();
app.use(cors());
app.use(express.json());

const APIkey = "your api key here";

app.post('/generate-monster', async (req, res) => {
    console.log('Received request to generate monster');
    try {
      const prompt = "I want to create an image of a random unique fantasy monster for my game with white background";
  
      // Generate the monster image using DALL·E 3 model
      const imageData = {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: "1024x1024"  // Ensure this is a supported size
      };
      const headers = {
        'Authorization': `Bearer ${APIkey}`,
        'Content-Type': 'application/json',
      };
  
      // Request image generation from OpenAI
      const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', imageData, { headers });
      const monsterImageUrl = imageResponse.data.data[0].url; // Get the generated image URL
  
      // Download the image as a buffer
      const imageResponseBuffer = await axios.get(monsterImageUrl, { responseType: 'arraybuffer' });
      const inputBuffer = Buffer.from(imageResponseBuffer.data);
      // still need to remove whitespace of new monster images
      // Convert image to PNG format, trim the background, and remove the background based on color threshold
    const trimmedImageBuffer = await sharp(inputBuffer)
    .ensureAlpha() // Ensure there is an alpha channel
    .png() // Convert to PNG format to support transparency
    .trim({ threshold: 254 }) // Trim off the white background; adjust the threshold as needed
    .toBuffer();

    // // Convert image to PNG format, trim the background, and remove the background based on color threshold
    // const trimmedImageBuffer = await sharp(inputBuffer)
    //   .png() // Convert to PNG format to support transparency
    //   .flatten({ background: '#ffffff' }) // Set white background for better edge detection
    //   .trim({ threshold: 240 }) // Trim off the white background; adjust the threshold as needed
    //   .toBuffer();

  // Set the appropriate headers and send the trimmed image data as response
  res.setHeader('Content-Type', 'image/png');
  res.send(trimmedImageBuffer);
    } catch (error) {
      console.error('Error generating monster image:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred while generating the monster image.' });
    }
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });