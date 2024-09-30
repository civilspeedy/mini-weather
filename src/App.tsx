import { useEffect, useState } from 'preact/hooks';
import './App.css';
import { useDate, useTime, useWeather } from './logic/hooks';
import { TimeWeather } from './logic/types';
import codes from '../src/assets/json/codes.json';

export default function App() {
    const [now, setNow] = useState<TimeWeather>();
    const weather = useWeather();
    const date = useDate().date;
    const dateInWords = useDate().inWords;
    const time = useTime();

    /**
     * Returns index relating to date and time.
     * @param target Date-time string relating to data being searched for.
     * @returns The index correlating to data.
     */
    const getIndex = (target: string): number => {
        const array = weather?.hourly.time;
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

    useEffect(() => {
        const index: number = getIndex(date + 'T' + time.split(':')[0] + ':00');
        const nowData: TimeWeather = getData(index);
        setNow(nowData);
    }, [weather]);

    return (
        <div>
            <p>{dateInWords}</p>
            <p>wind speed: {now?.windSpeed}</p>
            <p>weather code: {now?.weatherCode}</p>
        </div>
    );
}
