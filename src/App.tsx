import React, { useState } from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';
import ErrorMessage from './components/ErrorMessage';
import Icon from './components/Icon';
import { useWeather } from './logic/hooks';

export default function App(): React.JSX.Element {
  const weather = useWeather();
  const [error, setError] = useState<boolean>(true);

  return (
    <>
      {error ? (
        <>
          <div id='top'>
            <div id='left'>
              <div
                id='row'
                style={{ gap: 20 }}>
                <CurrentStat
                  value={weather.now?.temperature}
                  type='temp'
                />
                <CurrentStat
                  value={weather.now?.precipitationProb}
                  type='prec'
                />
              </div>
              <div
                id='row'
                style={{ gap: 20 }}>
                <CurrentStat
                  value={weather.now?.weatherCode}
                  type='code'
                />
                <CurrentStat
                  value={weather.now?.windSpeed}
                  type='wind'
                />
              </div>
            </div>
            <div id='right'>
              <Time />
            </div>
          </div>
          <div id='bottom'>
            <Icon />
          </div>
        </>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
