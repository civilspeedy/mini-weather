import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import { LocationData, WeatherData } from './types';

export const useScale = (original: number) => {
  const [size, setSize] = useState<number>();

  const scale: Promise<number> = invoke('scale', { original: original });

  useEffect(() => {
    const wait = async () => {
      setSize(await scale);
    };

    wait();
  }, []);

  return size;
};

export const useWeather = (): WeatherData | null => {
  // maybe do async
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://api.ipify.org')
        .then((response) => response.text())
        .then((ip) => fetch('http://ip-api.com/json/' + ip))
        .then((response) => response.json())
        .then((location: LocationData) => {
          if (!location.lat || !location.lon) {
            throw new Error('No location data');
          }
          return fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7`
          );
        })
        .then((response) => response.json())
        .then((response: WeatherData) => setData(response))
        .catch((error) => console.error(error));
    }, 36000);

    return () => clearInterval(interval);
  }, []);

  return data;
};
