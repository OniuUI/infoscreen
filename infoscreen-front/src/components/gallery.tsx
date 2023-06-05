import React, { useState, useEffect } from 'react';
import {apiService} from "./api/apiservice";
import '../components/css/gallery.css'; // Import the CSS file

interface ImageData {
  base64Image: string;
}

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    apiService.get(`/gallery`)
      .then((data: ImageData[]) => setImages(data.map((image: ImageData) => `data:image/jpeg;base64,${image.base64Image}`)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  return (
    <div className="slideshow-container">
      {images.map((image, index) => (
        <img
          className={`slide ${currentIndex === index ? 'active' : ''}`}
          src={image}
          alt={`Slide ${index + 1}`}
          key={index}
        />
      ))}
    </div>
    );
};

export default Gallery;
