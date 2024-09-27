import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'preact/hooks';
import { LocationData, Weather } from './types';

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
    const [weather, setWeather] = useState<Weather>();

    useEffect(() => {
        const getWeather = async () => {
            const ipRaw: Response = await fetch('https://api.ipify.org');
            const ip: string = await ipRaw.text();
            const locationRaw: Response = await fetch(
                'http://ip-api.com/json/' + ip
            );
            const location: LocationData = await locationRaw.json();

            const data = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7`
            );
            const json: Weather = await data.json();

            setWeather(json);
        };

        getWeather();

        const interval = setInterval(getWeather, 3600000);

        return () => clearInterval(interval);
    }, []);

    invoke('log', { msg: 'test' + JSON.stringify(weather) });

    return weather;
};

export const useNow = () => {
    const weather: Weather | undefined = useWeather();
    const [display, setDisplay] = useState();

    useEffect(() => {}, []);
};
