import { Hourly, TimeWeather, WeatherData } from './types';
import codes from '../assets/weather_codes.json';
import { getDate, getTime } from './api';
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

const getHours = (time: string): number => +time.split(':')[0];

/**
 * Takes an index and returns formatted data.
 * @param hourly The object containing hourly data.
 * @param index The index relating to when.
 * @returns An object containing data linked to provided index.
 */
function toTimeWeather(hourly: Hourly, index: number): TimeWeather {
    const time = hourly.time[index].split('T')[1];

    invoke('log', { msg: hourly });
    return {
        time: time,
        temperature: hourly.temperature_2m[index],
        weatherCode: WCS(hourly.weather_code[index], +time.split(':')[0]),
        precipitationProb: hourly.precipitation_probability[index],
        windSpeed: Math.round(hourly.wind_speed_10m[index] * 0.621371),
    };
}

/**
 * All To Now - Looks through all weather data and return weather for current date and time.
 * @param all All data.
 * @returns An object containing all data that applies now.
 */
export function ATN(all: WeatherData): TimeWeather {
    invoke('log', { msg: 'all2=' + JSON.stringify(all) });
    const time = getTime();
    const hours = getHours(time);

    const dateTime: string = getDate() + 'T' + hours + ':' + '00';
    const hourly = all.hourly;
    const index: number = getIndex(hourly.time, dateTime);

    return toTimeWeather(hourly, index);
}

/**
 * Gets data from specific day.
 * @param dateTimeArray Array containing all date-time strings.
 * @param date The target date.
 * @returns Array of TimeWeather data.
 */
function getDayIndices(
    dateTimeArray: string[],
    date: string,
    hourly: Hourly
): TimeWeather[] {
    let start = -1;
    let stop = -1;
    for (let i = 0; i < dateTimeArray.length; i++) {
        if (dateTimeArray[i].split('T')[0] === date) {
            if (start !== -1) stop = i;
            else start = i;
        }
    }

    const array: TimeWeather[] = [];
    for (let i = start; i < stop; i++) array.push(toTimeWeather(hourly, i));

    return array;
}

/**
 * Uses all weather data and returns data relevant for current data.
 * @param all Array containing all data.
 * @returns Array containing all data relating to current date.
 */
export function ATD(all: WeatherData): TimeWeather[] {
    return getDayIndices(all.hourly.time, getDate(), all.hourly);
}

/**
 * Date-String to String - Mostly to get month name.
 * @param dateString The date-string to be converted.
 * @returns The converted string.
 */
export function DsTS(dateString: string) {
    const months: readonly string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const split: string[] = dateString.split('-');
    const year: string = split[0];
    const month: string = months[+split[1] - 1];
    const day: string = split[2];

    return `${day} ${month} ${year}`;
}

/**
 * Date To Date string - Converts Date object to string.
 * @param dateValue The Date object.
 * @returns The Date value as a string.
 */
export function DTDs(dateValue: Date): string {
    return `${dateValue.getFullYear()}-${SDC(
        dateValue.getUTCMonth() + 1
    )}-${SDC(dateValue.getUTCDate())}`;
}

/**
 * Returns a date string for a future date.
 * @param number How many days ahead.
 * @returns The date formatted as a date-string.
 */
function getDayFromNow(number: number): string {
    const today = new Date();
    return DTDs(new Date(today.setDate(today.getDate() + number))); //from https://stackoverflow.com/a/3818198
}

/**
 * All (to) Tomorrow - returns array of data linked to the next day.
 * @param all All data.
 * @returns  An array containing all weather data for next day.
 */
export function ATM(all: WeatherData): TimeWeather[] {
    return getDayIndices(all.hourly.time, getDayFromNow(1), all.hourly);
}
