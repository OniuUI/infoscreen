// galleryController.js
const path = require('path');
const fs = require('fs');

exports.getImages = (req, res) => {
  const imageDirectory = path.join(__dirname, '../data/images');
  
  fs.readdir(imageDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const images = files.map(file => {
      const filePath = path.join(imageDirectory, file);
      let stats;

      try {
        stats = fs.statSync(filePath);
      } catch (error) {
        console.error('Unable to read image metadata:', error);
        return null;
      }

      return {
        url: `http://localhost:3001/images/${file}`,
        created: stats.birthtime,
        size: stats.size
      };
    }).filter(image => image); // Remove any null values due to errors

    res.json(images);
  });
};
