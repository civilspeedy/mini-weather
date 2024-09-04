import React, { useState } from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';

type CurrentWeather = {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
};

export default function App(): React.JSX.Element {
  const temp: CurrentWeather = {
    temperature: 20,
    precipitation: 8,
    humidity: 10,
    windSpeed: 5,
  };
  const [weatherData, setWeatherData] = useState<CurrentWeather>(temp);

  return (
    <>
      <div id='top'>
        <div id='left'>
          <div
            id='row'
            style={{ gap: 20 }}>
            <CurrentStat
              value={weatherData.temperature}
              type='temp'
            />
            <CurrentStat
              value={weatherData.precipitation}
              type='prec'
            />
          </div>
          <div
            id='row'
            style={{ gap: 20 }}>
            <CurrentStat
              value={weatherData.humidity}
              type='humid'
            />
            <CurrentStat
              value={weatherData.windSpeed}
              type='wind'
            />
          </div>
        </div>
        <div id='right'>
          <Time />
        </div>
      </div>
      <div id='bottom'></div>
    </>
  );
}
