import React, { useEffect, useState } from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';
import { CoreData, useWeather } from './logic/request';
import ErrorMessage from './components/ErrorMessage';
import { invoke } from '@tauri-apps/api';

export default function App(): React.JSX.Element {
  const data: CoreData | null = useWeather();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (data === null) setError(true);
    else setError(false);

    invoke('log', { message: data?.temperature[1] }); // doesn't work
  }, [data]);

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
          <div id='bottom'></div>
        </>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
