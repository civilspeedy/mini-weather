import React, { useEffect, useState } from 'react';
import { getFuture, Weather } from '../logic/Weather';

export default function Next(): React.JSX.Element {
  const [data, setData] = useState<Weather[]>([]);

  useEffect(() => {
    const currentValue: Weather[] = getFuture(7);

    if (currentValue.length !== 0) {
      setData(currentValue);
    }
  }, []);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <p>{item.temperature}</p>
          <p>{item.windSpeed}</p>
        </div>
      ))}
    </div>
  );
}
