import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import { getWeather } from './api';
import { WeatherData } from './types';

export function useScale(original: number): number {
    const [size, setSize] = useState<number>(0);

    const scale: Promise<number> = invoke('scale', { original: original });

    useEffect(() => {
        const wait = async () => {
            setSize(await scale);
        };

        wait();
    }, []);

    return size;
}

export function useWeather() {
    const [data, setData] = useState<WeatherData>();

    useEffect(() => {
        const requestData = async () => {
            const tempData: WeatherData = await getWeather();
            setData(tempData);
        };

        requestData();

        const interval = setInterval(requestData, 360000);
        return () => clearInterval(interval);
    }, []);

    return data;
}
