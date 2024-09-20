import { useDate, useTime } from './hooks';
import { TimeWeather, WeatherData } from './types';
import codes from '../assets/weather_codes.json';
import { invoke } from '@tauri-apps/api';

/**
 * Single Digit Checker - checks if a number is less than 10 and adds a 0 at the front if so.
 * @param number The number to be converted to string.
 * @returns The number as string with required formatting for date and time uses.
 */
export function SDC(number: number): string {
    return number < 10 ? '0' + number : number.toString();
}

/**
 * For getting the index of a date-time to locate relevant data.
 * @param array The date-time array.
 * @param target The specific date-time string.
 * @returns The index.
 */
function getIndex(array: string[], target: string): number {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) return i;
    }
    return -1;
}

/**
 * Weather Code (to) String - take a weather code number and returns the descriptive string.
 * @param code The number value for the weather code.
 * @param hours The time of day as some codes differ based on time.
 * @returns A string describing the weather code.
 */
function WCS(code: number, hours: number): string {
    type Key = keyof typeof codes;

    const codeAsString: string = code.toString();

    if (codeAsString in codes) {
        const stringCode = codes[codeAsString as Key];
        return hours >= 7 ? stringCode.day : stringCode.night;
    }
    return '';
}

/**
 * All To Now - Looks through all weather data and return weather for current date and time.
 * @param all All data.
 * @returns An object containing all data that applies now.
 */
export function ATN(all: WeatherData): Promise<TimeWeather> {
    // can't use hooks in here
    const HOURS: number = new Date().getHours();

    const DATE_TIME: string = useDate() + 'T' + HOURS + ':00';
    const HOURLY = all.hourly;
    const INDEX: number = getIndex(HOURLY.time, DATE_TIME);
    invoke('log', { msg: DATE_TIME });

    return {
        time: HOURS + ':00',
        temperature: HOURLY.temperature_2m[INDEX],
        weatherCode: WCS(HOURLY.weather_code[INDEX], HOURS),
        precipitationProb: HOURLY.precipitation_probability[INDEX],
        windSpeed: HOURLY.wind_speed_10m[INDEX],
    };
}
