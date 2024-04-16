// galleryController.js
const getDb = require('../db').getDb;
/**
 * @openapi
 * /api/gallery:
 *   get:
 *     tags:
 *       - Gallery
 *     description: Returns a list of images
 *     responses:
 *       200:
 *         description: A list of images.
 *       404:
 *         description: No images found.
 *       500:
 *         description: Unable to read image data.
 */
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

/**
 * @openapi
 * /api/gallery:
 *   post:
 *     tags:
 *       - Gallery
 *     description: Uploads a new image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateUploaded:
 *                 type: string
 *                 format: date-time
 *               imageName:
 *                 type: string
 *               base64Image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image successfully uploaded.
 *       400:
 *         description: Missing required image data.
 *       500:
 *         description: Unable to upload image.
 */
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

