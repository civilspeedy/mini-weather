import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import { getDate, getTime, getWeather } from './api';
import { TimeWeather, WeatherData } from './types';
import { ATD, ATM, ATN } from './conversions';

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
    const tempIntArray = new Int8Array([0]);
    const [all, setAll] = useState<WeatherData>({
        latitude: 0,
        longitude: 0,
        generationtime_ms: 0,
        utc_offset_seconds: 0,
        timezone: 'GMT',
        timezone_abbreviation: 'GMT',
        elevation: 38,
        hourly_units: {
            time: 'iso8601',
            temperature_2m: '°C',
            precipitation_probability: '%',
            weather_code: 'wmo code',
            wind_speed_10m: 'km/h',
        },
        hourly: {
            time: ['yyyy-mm-ddT00:00'],
            temperature_2m: tempIntArray,
            precipitation_probability: tempIntArray,
            weather_code: tempIntArray,
            wind_speed_10m: tempIntArray,
        },
    });
    // have this also return now and future weather
    const [now, setNow] = useState<TimeWeather>({
        time: '00:00',
        temperature: 0,
        windSpeed: 0,
        weatherCode: '',
        precipitationProb: 0,
    });
    const [day, setDay] = useState<TimeWeather[]>([]);
    const [tomorrow, setTomorrow] = useState<TimeWeather[]>([]);
    invoke('log', { msg: 'test' });

    useEffect(() => {
        const requestData = async (): Promise<void> => {
            const tempData: WeatherData = await getWeather(); // hmm
            setAll(tempData);

            setNow(ATN(tempData));
            setDay(ATD(tempData));
            setTomorrow(ATM(tempData));
        };

        const interval = setInterval(requestData, 360000);
        return () => clearInterval(interval);
    }, []);

    return { all, now, day, tomorrow };
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

        fetchDate();

        const interval = setInterval(fetchDate, 86_400_000);

        return () => clearInterval(interval);
    }, []);

    return date;
}
