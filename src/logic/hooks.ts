import { useEffect, useState } from 'preact/hooks';
import { LocationData, Weather } from './types';
import codes from '../assets/json/codes.json';
import { log } from './invoker';

/**
 * checks if a number is less than 10 and adds a 0 at the front if so.
 * @param number The number to be converted to string.
 * @returns The number as string with required formatting for date and time uses.
 */
function singleDigitChecker(number: number): string {
    return number < 10 ? '0' + number : number.toString();
}

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
        const getDate = () => {
            const dateObj = new Date();
            const year = dateObj.getFullYear();
            const month = singleDigitChecker(dateObj.getUTCMonth() + 1);
            const day = singleDigitChecker(dateObj.getUTCDate());
            setDate(year + '-' + month + '-' + day);
        };

        getDate();

        const interval = setInterval(getDate, 8.64e7);

        return () => clearInterval(interval);
    }, []);

    return date;
};

export const useWeather = () => {
    const [weather, setWeather] = useState<Weather>();

    useEffect(() => {
        log('weather', false);
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

    return weather;
};

/**
 * Takes a weather code number and returns the descriptive string.
 * @param code The number value for the weather code.
 * @param hours The time of day as some codes differ based on time.
 * @returns A string describing the weather code.
 */
export function weatherCodeToString(code: number, hours: number): string {
    type Key = keyof typeof codes;

    const codeAsString: string = code.toString();

    if (codeAsString in codes) {
        const stringCode = codes[codeAsString as Key];
        return hours >= 7 ? stringCode.day : stringCode.night;
    }
    return '';
}
