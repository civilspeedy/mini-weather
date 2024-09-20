import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import { getWeather } from './api';
import { TimeWeather, WeatherData } from './types';
import { ATN, SDC } from './conversions';

const DATE: Date = new Date();

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

    useEffect(() => {
        const requestData = async (): Promise<void> => {
            const tempData: WeatherData = await getWeather();
            setAll(tempData);
            setNow(ATN(tempData));
            await invoke('log', { msg: JSON.stringify(now) });
        };

        requestData();

        const interval = setInterval(requestData, 360000);
        return () => clearInterval(interval);
    }, []);

    return { all, now };
}

export function useTime(): string {
    const [time, setTime] = useState<string>('00:00');

    useEffect(() => {
        const getTime = (): void => {
            const HOURS: string = SDC(DATE.getHours());
            const MINUTES: string = SDC(DATE.getMinutes());
            setTime(HOURS + ':' + MINUTES);
        };

        getTime();

        const interval = setInterval(getTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return time;
}

export function useDate(): string {
    const [date, setDate] = useState<string>('yyyy-mm-dd');

    useEffect(() => {
        const getDate = (): void => {
            const YEAR: string = DATE.getFullYear().toString();
            const MONTH: string = SDC(DATE.getMonth());
            const DAY: string = SDC(DATE.getDay());

            setDate(`${YEAR}-${MONTH}-${DAY}`);
        };

        const interval = setInterval(getDate, 86_400_000);

        return () => clearInterval(interval);
    }, []);

    return date;
}
