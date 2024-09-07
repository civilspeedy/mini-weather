import { useEffect, useState } from 'react';

/**
 * Data type for data received from open-meteo for easier manipulation.
 */
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

/**
 * A simple date and time object for easier access and readability when dealing with date and time.
 */
type DateTime = {
    date: Date;
    time: Time;
};
/**
 * Simple day month year object for date variables.
 */
type Date = {
    day: number;
    month: number;
    year: number;
};
/**
 * Simple hours and minutes object to represent a time value.
 */
type Time = {
    hours: number;
    minutes: number;
};

/**
 * Requests weather data from open-meteo and returns a WeatherData object.
 * @returns the data from open-meteo that has been converted to WeatherData type/object.
 */
async function requestWeather(): Promise<WeatherData | null> {
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

/**
 * Converts a datetime string to the DataTime object/type.
 * @param string the datetime string to be converted.
 * @returns the converted DateTime value.
 */
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

/**
 * A type for the key data received from open-meteo api to be displayed.
 */
export type CoreData = {
    dateTime: DateTime[];
    temperature: number[];
    rainChance: number[];
    weather_code: number[];
    windSpeed: number[];
};

/**
 * Converts WeatherData type to CoreData.
 * @param data the WeatherData to be converted.
 * @returns Converted CoreData.
 */
function dataToCore(data: WeatherData | null): CoreData | null {
    if (data !== null) {
        const cutDownData = data.hourly;
        const dateTime: DateTime[] = [];

        for (let stringDT of cutDownData.time) {
            if (typeof stringDT === 'string') {
                const convertedDT: DateTime = stringToDate(stringDT);
                dateTime.push(convertedDT);
            }
        }

        return {
            dateTime,
            temperature: cutDownData.temperature_2m,
            rainChance: cutDownData.precipitation_probability,
            weather_code: cutDownData.weather_code,
            windSpeed: cutDownData.wind_speed_10m,
        };
    }

    return null;
}

/**
 * A custom hook to request and return a main weather data at a 1 hour interval.
 * @returns Weather data or null if API failed.
 */
export const useWeather = (): CoreData | null => {
    const [data, setData] = useState<CoreData | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            const fetchedData: WeatherData | null = await requestWeather();
            setData(dataToCore(fetchedData));
        };

        const timer = setInterval(() => fetchWeather(), 3600000);

        return () => clearInterval(timer);
    }, []);

    return data;
};
