import React from 'react';

type Types = { temperature: number; weatherCode: string };

export default function Icon({
    temperature,
    weatherCode,
}: Types): React.JSX.Element {
    return (
        <div
            style={{
                width: 100,
                height: 100,
                borderWidth: 3,
                borderRadius: 10,
                borderColor: 'black',
                borderStyle: 'solid',
                backgroundColor: 'red',
                display: 'flex',
            }}
        >
            <div style={{ margin: 'auto' }}>
                {temperature + ' ' + weatherCode}
            </div>
        </div>
    );
}
