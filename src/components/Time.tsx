import React from 'react';
import { useDate, useScale, useTime } from '../logic/hooks';
import { DsTS } from '../logic/conversions';

export default function Time(): React.JSX.Element {
    const time: string = useTime();
    const date: string = useDate();
    const size: number = useScale(7);

    return (
        <div style={{ position: 'absolute', right: '1%', top: '0.5%' }}>
            <h1
                style={{
                    fontSize: size,
                }}>
                {time}
            </h1>
            <p>{DsTS(date)}</p>
        </div>
    );
}
