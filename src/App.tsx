import React, { useState } from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';
import { useScale } from './logic/hooks';

//location request doesn't work on mac

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

  const size = useScale(10);

  return (
    <>
      <div id='top'>
        <p style={{ fontSize: size }}>test</p>
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
