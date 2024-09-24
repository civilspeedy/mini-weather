import React, { useEffect, useState } from 'react';
import { TimeWeather, WeatherData } from '../logic/types';
import { useTime } from '../logic/hooks';
import Icon from './Icon';

type Types = {
  weatherData: {
    all: WeatherData;
    now: TimeWeather;
    day: TimeWeather[];
    tomorrow: TimeWeather[];
  };
};

export default function Next({ weatherData }: Types): React.JSX.Element {
  const [display, setDisplay] = useState<TimeWeather[]>([]);
  const time = useTime();
  useEffect(() => {
    const day = weatherData.day;

    const getStartStop = () => {
      let start = -1;
      for (let i = 0; i < day.length; i++) {
        if (day[i].time === time.split(':')[0] + ':00') {
          start = i + 1;
        }
      }
      let stop = start + 5;
      return { start, stop };
    };

    const addTomorrow = () => {
      const difference = 5 - display.length;
      const tomorrowArray: TimeWeather[] = [];

      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          tomorrowArray.push(weatherData.tomorrow[i]);
        }
      }

      setDisplay(display.concat(tomorrowArray));
    };
    const indices = getStartStop();
    setDisplay(day.slice(indices.start, indices.stop)); //on launch starts at 01:00
    addTomorrow();
  }, [weatherData]);

  return (
    <div style={{ flexDirection: 'row', display: 'flex' }}>
      {display?.map((item, index) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <Icon
            key={index}
            temperature={item.temperature}
            weatherCode={item.weatherCode}
          />
          <p style={{ margin: 0, textAlign: 'center' }}>{item.time}</p>
        </div>
      ))}
    </div>
  );
}
