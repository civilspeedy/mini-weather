import React from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';
import { useWeather } from './logic/hooks';
import Next from './components/Next';

export default function App(): React.JSX.Element {
  const weather = useWeather();

  return (
    <>
      <div id='top'>
        <div id='left'>
          <div id='row' style={{ gap: 20 }}>
            <CurrentStat value={weather.now.temperature} type='temp' />
            <CurrentStat value={weather.now.precipitationProb} type='prec' />
          </div>
          <div id='row' style={{ gap: 20 }}>
            <CurrentStat value={weather.now.weatherCode} type='code' />
            <CurrentStat value={weather.now.windSpeed} type='wind' />
          </div>
        </div>
        <div id='right'>
          <Time />
        </div>
      </div>
      <div id='bottom'>
        <Next weatherData={weather} />
      </div>
    </>
  );
}
