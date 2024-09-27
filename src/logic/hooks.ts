import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'preact/hooks';

export const useTime = (): string => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const getTime = () => {
            const date = new Date();
            setTime(date.getHours() + ':' + date.getMinutes());
        };

        getTime();

        const interval = setInterval(getTime, 60000);

        return () => clearInterval(interval);
    }, []);

    return time;
};

export const useWeather = () => {
    const [weather, setWeather] = useState<object>({});

    useEffect(() => {
        const getWeather = async () => {
            const data = await fetch(
                'http://api.weatherapi.com/v1/forecast.json?key=8f7123ac24e64971b15143351240602&q=London&days=7cl'
            );
            const json = await data.json();

            setWeather(json);
        };

        getWeather();

        const interval = setInterval(getWeather, 3600000);

        return () => clearInterval(interval);
    }, []);

    invoke('log', { msg: 'test' + JSON.stringify(weather) });

    return weather;
};
