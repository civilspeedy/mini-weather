import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'preact/hooks';
import { Hourly, LocationData, TimeWeather, Weather } from './types';
import codes from '../assets/json/codes.json';

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

// dont forget string conversion for numbers
export const useDate = () => {
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        const dateObj = new Date();
        setDate(
            `${dateObj.getFullYear()}-${SDC(dateObj.getUTCMonth() + 1)}-${SDC(
                dateObj.getUTCDate()
            )}`
        );
    }, []);
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

/**
 * For getting the index of a date-time to locate relevant data.
 * @param target The specific date-time string.
 * @returns The index.
 */
function getIndex(target: string): number {
    const array = useWeather()?.hourly.time;
    if (array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === target) return i;
        }
    }
    return -1;
}

/**
 * Weather Code (to) String - take a weather code number and returns the descriptive string.
 * @param code The number value for the weather code.
 * @param hours The time of day as some codes differ based on time.
 * @returns A string describing the weather code.
 */
function WCS(code: number, hours: number): string {
    type Key = keyof typeof codes;

    const codeAsString: string = code.toString();

    if (codeAsString in codes) {
        const stringCode = codes[codeAsString as Key];
        return hours >= 7 ? stringCode.day : stringCode.night;
    }
    return '';
}

/**
 * Takes an index and returns formatted data.
 * @param hourly The object containing hourly data.
 * @param index The index relating to when.
 * @returns An object containing data linked to provided index.
 */
function toTimeWeather(hourly: Hourly, index: number): TimeWeather {
    const time = hourly.time[index].split('T')[1];

    invoke('log', { msg: hourly });
    return {
        time: time,
        temperature: hourly.temperature_2m[index],
        weatherCode: WCS(hourly.weather_code[index], +time.split(':')[0]),
        precipitationProb: hourly.precipitation_probability[index],
        windSpeed: Math.round(hourly.wind_speed_10m[index] * 0.621371),
    };
}
