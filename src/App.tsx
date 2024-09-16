import React, { useEffect, useState } from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';
import ErrorMessage from './components/ErrorMessage';
import Icon from './components/Icon';
import Weather from './logic/Weather';

export default function App(): React.JSX.Element {
  const weather = new Weather(); // not sure how to implement
  const [error, setError] = useState<boolean>(false);

  return (
    <>
      {error ? (
        <>
          <div id='top'>
            <div id='left'>
              <div
                id='row'
                style={{ gap: 20 }}
              >
                <CurrentStat
                  value={0}
                  type='temp'
                />
                <CurrentStat
                  value={0}
                  type='prec'
                />
              </div>
              <div
                id='row'
                style={{ gap: 20 }}
              >
                <CurrentStat
                  value={0}
                  type='humid'
                />
                <CurrentStat
                  value={0}
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
