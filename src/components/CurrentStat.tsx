import React, { useState, useEffect } from 'react';
import { useScale } from '../logic/hooks';

type Data = { value: number | string; type: string };
type Text = { title: string; measurement: string };

export default function CurrentStat({ value, type }: Data): React.JSX.Element {
    const [text, setText] = useState<Text>({
        title: '',
        measurement: '',
    });

    const h2Size = useScale(2);
    const pSize = useScale(3);

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
            <h2 style={{ fontSize: h2Size }}>{text.title}</h2>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <p style={{ fontSize: pSize, fontWeight: 'bold' }}>{value}</p>
                <h2 style={{ fontSize: h2Size }}>{text.measurement}</h2>
            </div>
        </div>
    );
}
