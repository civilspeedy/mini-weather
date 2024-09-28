import { useEffect, useState } from 'preact/hooks';
import './App.css';
import {
    useDate,
    useTime,
    useWeather,
    weatherCodeToString,
} from './logic/hooks';
import { TimeWeather } from './logic/types';

function App() {
    const [now, setNow] = useState<TimeWeather>();
    const weather = useWeather();
    const date = useDate();
    const time = useTime();

    const getIndex = (target: string): number => {
        const array = weather?.hourly.time;
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] === target) return i;
            }
        }
        return -1;
    };

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
                    hourly.weather_code[index],
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
            <p>{weather?.hourly.temperature_2m[0]}</p>
            <p>{date}</p>
            <p>{time}</p>
        </div>
    );
}

export default App;
