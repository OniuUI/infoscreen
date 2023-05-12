import React, { useState, useEffect } from 'react';

interface CarouselProps {
  children: React.ReactNode | React.ReactNode[];
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ children, interval = 5000 }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (childrenArray.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [childrenArray.length, interval]);

  return <>{childrenArray[activeIndex]}</>;
};

export default Carousel;
