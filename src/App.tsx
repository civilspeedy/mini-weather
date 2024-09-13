import React, { useEffect, useState } from 'react';
import './App.css';
import Time from './components/Time';
import CurrentStat from './components/CurrentStat';
import { useRequest } from './logic/request';
import ErrorMessage from './components/ErrorMessage';
import Icon from './components/Icon';

export default function App(): React.JSX.Element {
  const data = useRequest();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (data === null) setError(true);
    else setError(false);
  }, [data]);

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
                style={{ gap: 20 }}>
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
