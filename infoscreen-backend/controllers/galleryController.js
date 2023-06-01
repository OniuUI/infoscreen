// galleryController.js
const getDb = require('../db').getDb;

exports.getImages = async (req, res) => {
  try {
    const db = getDb();
    const images = await db.collection('images').find().toArray();

    if (images.length > 0) {
      res.json(images);
    } else {
      res.status(404).send({ error: "No images found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Unable to read image data." });
  }
};


exports.addImage = async (req, res) => {
  const { userId, firstName, lastName, dateUploaded, imageName, base64Image } = req.body;

  // Validation to ensure all necessary data is present
  if (!userId || !firstName || !lastName || !dateUploaded || !imageName || !base64Image) {
    return res.status(400).json({ error: "Missing required image data." });
  }

  try {
    const db = getDb();
    const image = {
      userId,
      firstName,
      lastName,
      dateUploaded: new Date(dateUploaded), // ensure date is stored as a Date object
      imageName,
      base64Image
    };

    await db.collection('images').insertOne(image);

    res.status(201).json({ message: "Image successfully uploaded." });
  } catch (err) {
    console.error('Unable to upload image:', err);
    res.status(500).json({ error: "Unable to upload image." });
  }
};

