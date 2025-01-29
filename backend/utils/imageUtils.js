// utils/imageUtils.js
const sharp = require('sharp');

// Define the function first
const removeWhiteBackgroundFromBuffer = async (inputBuffer) => {
    try {
        const image = sharp(inputBuffer);
        const metadata = await image.metadata();
        const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
        const { width, height, channels } = info;
        const pixelCount = width * height;
        const threshold = 245; // Adjust threshold for white
        const outputBuffer = Buffer.alloc(pixelCount * 4);

        for (let i = 0; i < pixelCount; i++) {
            const idxIn = i * channels;
            const idxOut = i * 4;
            const r = data[idxIn], g = data[idxIn + 1], b = data[idxIn + 2];

            if (r >= threshold && g >= threshold && b >= threshold) {
                outputBuffer[idxOut] = r; outputBuffer[idxOut + 1] = g;
                outputBuffer[idxOut + 2] = b; outputBuffer[idxOut + 3] = 0; // Transparent
            } else {
                outputBuffer[idxOut] = r; outputBuffer[idxOut + 1] = g;
                outputBuffer[idxOut + 2] = b; outputBuffer[idxOut + 3] = 255; // Opaque
            }
        }

        return await sharp(outputBuffer, { raw: { width, height, channels: 4 } }).png().toBuffer();
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
};

// Then export it
module.exports = {
    removeWhiteBackgroundFromBuffer
};
