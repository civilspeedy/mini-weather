import React from 'react';
import { useScale, useTime } from '../logic/hooks';

export default function Time(): React.JSX.Element {
    const time: string = useTime();
    const size: number = useScale(7);

    return (
        <h1
            style={{
                position: 'absolute',
                right: '1%',
                top: '0.5%',
                fontSize: size,
            }}
        >
            {time}
        </h1>
    );
}
