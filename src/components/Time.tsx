import React, { useEffect, useState } from 'react';

export default function Time(): React.JSX.Element {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const date: Date = new Date();
      const hours: number = date.getHours();
      const minutes: number = date.getMinutes();
      setTime(timeStringify(hours) + ':' + timeStringify(minutes));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 style={{ position: 'absolute', right: '1%', top: '0.5%' }}>{time}</h1>
  );
}

function timeStringify(time: number): string {
  let string: string = '' + time;
  if (time < 10) {
    string = '0' + time;
  }
  return string;
}
