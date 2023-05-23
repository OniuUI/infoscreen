const path = require('path');
const fs = require('fs');

exports.getImages = (req, res) => {
  const imageDirectory = path.join(__dirname, '../data/images');
  
  fs.readdir(imageDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Assuming your server is running on port 3001
    const imageFiles = files.map(file => `http://localhost:3001/images/${file}`);
    res.json(imageFiles);
  });
};
