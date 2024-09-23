require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sharp = require('sharp'); // Import Sharp

const app = express();
app.use(cors());
app.use(express.json());

const APIkey = "";

async function removeWhiteBackgroundFromBuffer(inputBuffer) {
  try {
    // Read the image without altering alpha channel
    const image = sharp(inputBuffer);

    // Get image metadata
    const metadata = await image.metadata();

    // Define the threshold for white pixels
    const threshold = 242; // Adjust as needed (0-255)

    // Extract raw pixel data
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixelCount = width * height;

    // Output buffer needs to be large enough for 4 channels per pixel
    const outputBuffer = Buffer.alloc(pixelCount * 4);

    for (let i = 0; i < pixelCount; i++) {
      const idxIn = i * channels; // Index for input buffer
      const idxOut = i * 4;       // Index for output buffer (always 4 channels)

      const r = data[idxIn];
      const g = data[idxIn + 1];
      const b = data[idxIn + 2];

      // Determine if the pixel is near white
      if (r >= threshold && g >= threshold && b >= threshold) {
        // Set alpha to 0 (transparent)
        outputBuffer[idxOut] = r;
        outputBuffer[idxOut + 1] = g;
        outputBuffer[idxOut + 2] = b;
        outputBuffer[idxOut + 3] = 0;
      } else {
        // Keep original pixel and set alpha to fully opaque
        outputBuffer[idxOut] = r;
        outputBuffer[idxOut + 1] = g;
        outputBuffer[idxOut + 2] = b;
        outputBuffer[idxOut + 3] = 255;
      }
    }

    // Create the output image with alpha channel
    const outputImageBuffer = await sharp(outputBuffer, {
      raw: {
        width: width,
        height: height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();

    return outputImageBuffer;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

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

      // Remove the white background using the function
      const processedImageBuffer = await removeWhiteBackgroundFromBuffer(inputBuffer);


  // Set the appropriate headers and send the trimmed image data as response
  res.setHeader('Content-Type', 'image/png');
  res.send(processedImageBuffer);
    } catch (error) {
      console.error('Error generating monster image:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred while generating the monster image.' });
    }
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });