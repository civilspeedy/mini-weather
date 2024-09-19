import { useEffect, useState } from 'react';
import { LocationData, WeatherData } from './types';

const useWeather = (): WeatherData | null => {
    const [data, setData] = useState<WeatherData | null>(null);
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('https://api.ipify.org')
                .then((ip) => fetch('http://ip-api.com/json/' + ip.text()))
                .then((location) => location.json())
                .then((location) => {
                    let newLoc: LocationData = location;
                    return fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${newLoc.lat}&longitude=${newLoc.lon}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7`
                    );
                })
                .then((response) => response.json())
                .then((response) => setData(response));
        }, 360000);

        return () => clearInterval(interval);
    }, []);

    return data;
};
