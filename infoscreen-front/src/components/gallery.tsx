import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch images from server on component mount
  useEffect(() => {
      fetch(`${API_BASE_URL}/images`)
      .then(res => res.json())
      .then(setImages)
      .catch(console.error);
  }, []);

  // Change image every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalId); // Clear on unmount
  }, [currentIndex, images.length]);

  // Render current image
  return images.length > 0 ? (
    <img src={images[currentIndex]} alt="Slideshow" />
  ) : (
    <p>Loading...</p>
  );
};

export default Gallery;
