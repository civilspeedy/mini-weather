import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import { getDate, getTime, getWeather } from './api';
import { TimeWeather, WeatherData } from './types';
import { ATD, ATN } from './conversions';

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
    const [all, setAll] = useState<WeatherData>();
    // have this also return now and future weather
    const [now, setNow] = useState<TimeWeather>();
    const [day, setDay] = useState<TimeWeather[]>();

    useEffect(() => {
        const requestData = async (): Promise<void> => {
            const tempData: WeatherData = await getWeather();
            setAll(tempData);
            setNow(ATN(tempData));
            setDay(ATD(tempData));
        };

        requestData();

        const interval = setInterval(requestData, 360000);
        return () => clearInterval(interval);
    }, []);

    return { all, now, day };
}

export function useTime(): string {
    const [time, setTime] = useState<string>('00:00');

    useEffect(() => {
        const fetchTime = () => {
            const FETCHED_TIME: string = getTime();
            setTime(FETCHED_TIME);
        };

        const interval = setInterval(fetchTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return time;
}

export function useDate(): string {
    const [date, setDate] = useState<string>('yyyy-mm-dd');

    useEffect(() => {
        const fetchDate = () => {
            const FETCHED_DATE: string = getDate();
            setDate(FETCHED_DATE);
        };

        const interval = setInterval(fetchDate, 86_400_000);

        return () => clearInterval(interval);
    }, []);

    return date;
}
