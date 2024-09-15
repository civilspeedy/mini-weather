import React, { useEffect, useState } from 'react';
import { useScale } from '../logic/hooks';
import { SDC } from '../logic/Weather';

export default function Time(): React.JSX.Element {
  const [time, setTime] = useState<string>('');
  const size = useScale(7);

  useEffect(() => {
    const interval = setInterval(() => {
      const date: Date = new Date();
      const hours: number = date.getHours();
      const minutes: number = date.getMinutes();
      setTime(SDC(hours) + ':' + SDC(minutes));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      style={{
        position: 'absolute',
        right: '1%',
        top: '0.5%',
        fontSize: size,
      }}>
      {time}
    </h1>
  );
}
