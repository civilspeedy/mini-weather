import React, { useEffect, useState } from 'react';
import { TimeWeather } from '../logic/types';
import { useTime } from '../logic/hooks';
import Icon from './Icon';
import { invoke } from '@tauri-apps/api';

type Types = {
  weatherData: {
    day: TimeWeather[];
    tomorrow: TimeWeather[];
  };
};

export default function Next({ weatherData }: Types): React.JSX.Element {
  const [display, setDisplay] = useState<TimeWeather[]>([]);
  const time = useTime();
  useEffect(() => {
    const day = weatherData.day;
    // need to add tomorrow but unsure
    const getStartStop = () => {
      let start = 0;
      for (let i = 0; i < day.length; i++) {
        invoke('log', { msg: time });
        if (day[i].time === time.split(':')[0] + ':00') {
          start = i + 1;
        }
      }
      let stop = start + 5;
      return { start, stop };
    };

    const indices = getStartStop();
    invoke('log', { msg: indices.start + '|' + indices.stop });
    setDisplay(day.slice(indices.start, indices.stop));
  }, [time]);

  return (
    <div style={{ flexDirection: 'row', display: 'flex' }}>
      {display?.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <Icon temperature={item.temperature} weatherCode={item.weatherCode} />
          <p style={{ margin: 0, textAlign: 'center' }}>{item.time}</p>
        </div>
      ))}
    </div>
  );
}
