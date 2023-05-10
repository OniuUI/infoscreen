// src/components/Temperature.tsx
import React, { useState, useEffect } from "react";
import WeatherIcon from "./weathericon";

const Temperature: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [feelsLike, setFeelsLike] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [symbolCode, setsymbolCode] = useState<string | null>(null);
  const windIcon = windSpeed && windSpeed >= 5 ? '🌬️' : '🍃';

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch(
          "https://www.yr.no/api/v0/locations/1-2333511/forecast/currenthour"
        );
        const data = await response.json();
        setTemperature(data.temperature.value);
        setFeelsLike(data.temperature.feelsLike);
        setWindSpeed(data.wind.speed);
        setsymbolCode(data.symbolCode.next1Hour);
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
      <div className={'temprature'} style={{ textAlign: 'center' }}>
        <h1>Fornebu</h1>
        {symbolCode && <WeatherIcon symbolCode={symbolCode} />}
        {temperature !== null && (
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {temperature.toFixed(1)}°C
          </p>
        )}
        {feelsLike !== null && (
          <p style={{ fontSize: '16px' }}>
            Feels like {feelsLike.toFixed(1)}°C
          </p>
        )}
        {windSpeed !== null && (
          <p style={{ fontSize: '16px' }}>
            {windIcon} Wind: {windSpeed.toFixed(1)} m/s
          </p>
        )}
      </div>
    </div>
    );
};

export default Temperature;
