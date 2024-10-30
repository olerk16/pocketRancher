require('dotenv').config(); // Make sure this is at the very top
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Function to upload images to S3
const uploadImageToS3 = async (fileName, filePath) => {
  const fileContent = fs.readFileSync(filePath);

  console.log('S3 Bucket Name:', process.env.AWS_S3_BUCKET_NAME);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `monsters/${fileName}`, // Save the image in the "monsters" folder within the bucket
    Body: fileContent,
    ContentType: 'image/png' // Assuming the images are PNGs
  };

  return s3.upload(params).promise();
};

// Function to seed monster images
const seedMonsterImages = async () => {
  try {
    const imageDirectory = path.join(__dirname, '../../assets/images/monsters');
    const files = fs.readdirSync(imageDirectory);

    for (const file of files) {
      const filePath = path.join(imageDirectory, file);
      const uploadResult = await uploadImageToS3(file, filePath);

      // Print the URL to access the image
      console.log(`Image ${file} uploaded successfully: ${uploadResult.Location}`);
    }

    console.log('All monster images uploaded successfully!');
  } catch (error) {
    console.error('Error uploading images:', error);
  }
};

seedMonsterImages();
