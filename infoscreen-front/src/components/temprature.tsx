// src/components/Temperature.tsx
import React, { useState, useEffect } from "react";

const Temperature: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [feelsLike, setFeelsLike] = useState<number | null>(null);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch(
          "https://www.yr.no/api/v0/locations/1-2333511/forecast/currenthour"
        );
        const data = await response.json();
        setTemperature(data.temperature.value);
        setFeelsLike(data.temperature.feelsLike);
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperature();

    const interval = setInterval(() => {
      fetchTemperature();
    }, 1800000); // Update every 30 minutes (1800000 ms)

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {temperature !== null && <p>Temperature: {temperature}°C</p>}
      {feelsLike !== null && <p>Feels like: {feelsLike}°C</p>}
    </div>
    );
};

export default Temperature;
