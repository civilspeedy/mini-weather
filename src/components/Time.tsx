import React, { useEffect, useState } from 'react';

export default function Time(): React.JSX.Element {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            const date: Date = new Date();
            const hours: number = date.getHours();
            const minutes: number = date.getMinutes();
            setTime(hours + ':' + minutes);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <h1>{time}</h1>;
}
