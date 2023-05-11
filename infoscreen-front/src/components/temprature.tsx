import React, { useState, useEffect } from "react";
import WeatherIcon from "./weathericon";
import './css/temprature.css'; // Import the CSS file

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
    <div className="weather-card">
      <div className='temperature'>
        <h1 className='location-name'>Fornebu</h1>
        {symbolCode && <WeatherIcon symbolCode={symbolCode} className='weather-icon' />}
        {temperature !== null && (
          <p className='temperature-value'>
            {temperature.toFixed(1)}°C
          </p>
        )}
        {feelsLike !== null && (
          <p className='feels-like'>
            Feels like {feelsLike.toFixed(1)}°C
          </p>
        )}
        {windSpeed !== null && (
          <p className='wind-speed'>
            {windIcon} Wind: {windSpeed.toFixed(1)} m/s
          </p>
        )}
      </div>
    </div>
    );
};

export default Temperature;
