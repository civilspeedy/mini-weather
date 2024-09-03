import React, { useState, useEffect } from 'react';

type Data = { value: number; type: string };
type Text = { title: string; measurement: string };

export default function CurrentStat({ value, type }: Data): React.JSX.Element {
  const [text, setText] = useState<Text>({
    title: '',
    measurement: '',
  });

  useEffect(() => {
    setText(() => {
      switch (type) {
        case 'temp':
          return { title: 'Temperature', measurement: '°' };
        case 'prec':
          return { title: 'Precipitation', measurement: '%' };
        case 'humid':
          return { title: 'Humidity', measurement: '%' };
        case 'wind':
          return { title: 'Wind Speed', measurement: 'mph' };
        default:
          return {
            title: '',
            measurement: '',
          };
      }
    });
  }, [type]);

  return (
    <div style={{ margin: 0 }}>
      <h2>{text.title}</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <h3>{value}</h3>
        <h2>{text.measurement}</h2>
      </div>
    </div>
  );
}
