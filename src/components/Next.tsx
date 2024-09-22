import React, { useEffect, useState } from 'react';
import { TimeWeather } from '../logic/types';
import { invoke } from '@tauri-apps/api';
import { useTime } from '../logic/hooks';
import Icon from './Icon';

type Types = { data: TimeWeather[] };

export default function Next({ data }: Types): React.JSX.Element {
    const [display, setDisplay] = useState<TimeWeather[]>();
    const time = useTime();
    useEffect(() => {
        let start = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].time === time.split(':')[0] + ':00') {
                start = i + 1;
            }
        }

        setDisplay(data.slice(start));

        invoke('log', { msg: JSON.stringify(display) });
    }, [data]);

    return (
        <div style={{ flexDirection: 'row', display: 'flex' }}>
            {display?.map((item, index) => (
                <Icon
                    key={index}
                    temperature={item.temperature}
                    weatherCode={item.weatherCode}
                />
            ))}
        </div>
    );
}
