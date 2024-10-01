import { useEffect, useState } from 'preact/hooks';
import { LocationData, Weather } from './types';
import template from '../assets/json/template.json';

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
            setTime(
                singleDigitChecker(date.getHours()) +
                    ':' +
                    singleDigitChecker(date.getMinutes())
            );
        };

        getTime();

        const interval = setInterval(getTime, 60000);

        return () => clearInterval(interval);
    }, []);

    return time;
};

export const useDate = () => {
    const [date, setDate] = useState<string>('');
    const [inWords, setInWords] = useState<string>('');

    const MONTHS: readonly string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const DAYS: readonly string[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    useEffect(() => {
        const getDate = () => {
            const dateObj = new Date();
            const year: number = dateObj.getFullYear();
            const month: string = singleDigitChecker(dateObj.getUTCMonth() + 1);
            const day: string = singleDigitChecker(dateObj.getUTCDate());

            const dayNumber: number = dateObj.getDay();
            const dayName: string = DAYS[dayNumber];
            const monthName: string = MONTHS[+month];

            let numberEnd = 'th';

            switch (day.substring(day.length - 1)) {
                case '1':
                    numberEnd = 'st';
                    break;
                case '2':
                    numberEnd = 'nd';
                    break;
                case '3':
                    numberEnd = 'rd';
                    break;
            }

            setDate(year + '-' + month + '-' + day);
            setInWords(
                dayName + ' ' + +day + numberEnd + ' ' + monthName + ' ' + year
            );
        };

        getDate();

        const interval = setInterval(getDate, 60000);

        return () => clearInterval(interval);
    }, []);

    return { date, inWords };
};

export const useWeather = () => {
    const [weather, setWeather] = useState<Weather>(template);
    const [city, setCity] = useState<string>('');

    useEffect(() => {
        const getWeather = async () => {
            const ipRaw: Response = await fetch('https://api.ipify.org');
            const ip: string = await ipRaw.text();
            const locationRaw: Response = await fetch(
                'http://ip-api.com/json/' + ip
            );
            const location: LocationData = await locationRaw.json();
            setCity(location.city);

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

    return { weather, city };
};
