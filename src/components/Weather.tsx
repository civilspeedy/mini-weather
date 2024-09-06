import { useEffect, useState } from 'react';
import { requestWeather, WeatherData } from '../logic/request';

export default function Weather() {
    const [data, setData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const value: WeatherData | null = await requestWeather();
            if (value !== null) {
                setData(value);
            }
        };

        const interval = setInterval(() => {
            fetchWeatherData();
        }, 3600000);

        return () => clearInterval(interval);
    }, []);
}
