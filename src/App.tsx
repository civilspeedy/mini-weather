import { useEffect, useState } from 'preact/hooks';
import './App.css';
import {
    singleDigitChecker,
    useDate,
    useTime,
    useWeather,
} from './logic/hooks';
import { TimeWeather } from './logic/types';
import codes from '../src/assets/json/codes.json';

export default function App() {
    const [now, setNow] = useState<TimeWeather>({
        time: '00:00',
        temperature: 0,
        weatherCode: '',
        windSpeed: 0,
        precipitationProb: 0,
    });
    const [next, setNext] = useState<TimeWeather[]>();
    const weatherHook = useWeather();
    const weather = weatherHook.weather;
    const city = weatherHook.city;
    const date = useDate().date;
    const dateInWords = useDate().inWords;
    const time = useTime();

    /**
     * Returns index relating to date and time.
     * @param target Date-time string relating to data being searched for.
     * @returns The index correlating to data.
     */
    const getIndex = (target: string): number => {
        const array = weather.hourly.time;
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] === target) return i;
            }
        }
        return -1;
    };

    /**
     * Takes a weather code number and returns the descriptive string.
     * @param code The number value for the weather code.
     * @param hours The time of day as some codes differ based on time.
     * @returns A string describing the weather code.
     */
    const weatherCodeToString = (code: number, hours: number) => {
        type Key = keyof typeof codes;

        const codeAsString: string = code.toString();

        if (codeAsString in codes) {
            const stringCode = codes[codeAsString as Key];
            return hours >= 7 ? stringCode.day : stringCode.night;
        }
        return '';
    };

    /**
     * Uses provided index to return all relevant data.
     * @param index The index relating to date and time of data
     * @returns Object containing relevant data.
     */
    const getData = (index: number): TimeWeather => {
        let data: TimeWeather = {
            time: '',
            temperature: 0,
            weatherCode: '',
            precipitationProb: 0,
            windSpeed: 0,
        };
        const hourly = weather?.hourly;
        if (hourly) {
            const time = hourly.time[index].split('T')[1];

            data = {
                time: time,
                temperature: hourly.temperature_2m[index],
                weatherCode: weatherCodeToString(
                    weather.hourly.weather_code[index],
                    +time.split(':')[0]
                ),
                precipitationProb: hourly.precipitation_probability[index],
                windSpeed: Math.round(hourly.wind_speed_10m[index] * 0.621371),
            };
        }
        return data;
    };

    const getDay = (target: string): TimeWeather[] => {
        const timeArray = weather.hourly.time;
        const array: TimeWeather[] = [];
        let start = -1;
        let stop = -1;

        for (let i = 0; i < timeArray.length; i++) {
            const dateString: string = timeArray[i].split('T')[0];
            if (dateString === target) {
                if (start !== -1) stop = i;
                else start = i;
            }
        }

        for (let i = start; i < stop; i++) {
            array.push(getData(i));
        }

        return array;
    };

    const getNext = (): TimeWeather[] => {
        const dayDataArray = getDay(date);

        const hours = time.split(':')[0];
        let cutoff = 0;

        for (let i = 0; i < dayDataArray.length; i++) {
            if (dayDataArray[i].time === hours + ':00') {
                cutoff = i + 1;
                break;
            }
        }

        const nextArray: TimeWeather[] = dayDataArray.splice(cutoff);

        const difference = 5 - nextArray.length;

        if (difference > 0) {
            const today: number = Date.parse(date);
            const tomorrow: Date = new Date(today + 1);
            const dateString =
                tomorrow.getUTCFullYear() +
                '-' +
                singleDigitChecker(tomorrow.getUTCMonth() + 1) +
                '-' +
                singleDigitChecker(tomorrow.getDay());

            const tomorrowData: TimeWeather[] = getDay(dateString);

            for (let i = 0; (i = difference); i++) {
                nextArray.push(tomorrowData[i]);
            }
        }

        return nextArray;
    };

    useEffect(() => {
        const index: number = getIndex(date + 'T' + time.split(':')[0] + ':00');
        const nowData: TimeWeather = getData(index);
        setNow(nowData);

        const nextData: TimeWeather[] = getNext();
        setNext(nextData);
    }, [weather]);

    return (
        <div>
            <p>{city + ' | ' + dateInWords + ' | ' + time}</p>
            <p>Temperature: {now.temperature}°C</p>
            <p>Chance of Rain: {now.precipitationProb}%</p>
            <p>Wind: {now?.windSpeed}mph</p>
            <p>weather code: {now?.weatherCode}</p>
            <div>
                {next?.map((item, index) => (
                    <div key={index}>
                        <p>{item.temperature}°C</p>
                        <p>{item.weatherCode}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
