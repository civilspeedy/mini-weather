import { invoke } from '@tauri-apps/api';

export type WeatherData = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
        time: string;
        temperature_2m: string;
        precipitation_probability: string;
        weather_code: string;
        wind_speed_10m: string;
    };
    hourly: {
        time: string[] | DateTime[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weather_code: number[];
        wind_speed_10m: number[];
    };
};

type DateTime = {
    date: Date;
    time: Time;
};
type Date = {
    day: number;
    month: number;
    year: number;
};
type Time = {
    hours: number;
    minutes: number;
};

export async function requestWeather(): Promise<WeatherData | null> {
    const request = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=1'
    );

    const response = await request.text();

    let weatherData: WeatherData = JSON.parse(response);

    const timeArray = weatherData.hourly.time;
    for (let i = 0; i < timeArray.length; i++) {
        const originalDateTime = timeArray[i];

        if (typeof originalDateTime === 'string') {
            weatherData.hourly.time[i] = stringToDate(originalDateTime);
        }
    }

    return weatherData;
}

function stringToDate(string: string): DateTime {
    const segments = string.split('-');

    const dayAndTime = segments[2].split('T');

    const year: number = parseInt(segments[0]);
    const month: number = parseInt(segments[1]);
    const day: number = parseInt(dayAndTime[0]);

    const hoursAndMinutes = dayAndTime[1].split(':');
    const hours: number = parseInt(hoursAndMinutes[0]);
    const minutes: number = parseInt(hoursAndMinutes[1]);

    const date: Date = { year, month, day };
    const time: Time = { hours, minutes };

    return { date, time };
}

type WhatKey = keyof WeatherData['hourly'];

async function getData(
    data: WeatherData,
    what: WhatKey,
    when: string
): Promise<number | null> {
    let return_data: number = 0;

    if (data !== null) {
        return_data = await invoke('rusty_search', {
            when: when,
            data: data.hourly[what],
            time_list: data.hourly.time,
        });
        return return_data;
    }

    return null;
}
