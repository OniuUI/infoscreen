// src/components/WeatherIcon.tsx
import React from 'react';
import iconURL from './img/weather.svg';

interface WeatherIconProps {
    symbolCode: string;
}

const WeatherIcon: React.FC<{ symbolCode: string, className?: string }> = ({ symbolCode, className }) => {
    return <img src={iconURL} alt={symbolCode} style={{ width: '50px', height: '50px' }} />;
};

export default WeatherIcon;
