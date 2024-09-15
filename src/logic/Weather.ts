import {
  DoubleIndex,
  Geolocate,
  NumberDate,
  NumberTime,
  TimeWeather,
  WeatherData,
} from './types';
import codes from '../assets/weather_codes.json';

class Weather {
  private data: WeatherData | undefined;
  private ip: string | undefined;
  private location: Geolocate | undefined;
  date: Date;

  /**
   * Constructor where initializer method is called and date is defined.
   */
  public constructor() {
    this.init();
    this.date = new Date();
  }

  /**
   * Initializer method to get values that are from outside sources.
   */
  private async init() {
    try {
      this.ip = await this.getIP();
      this.location = await this.getLocation();

      const lat: number = this.location.lat;
      const long: number = this.location.lon;

      this.data = await this.getWeather(lat, long);
      console.log(this.getWeatherOnDate({ year: 2024, month: 9, day: 15 })); // works
    } catch (e) {
      console.error('err: ', e);
    }
  }

  /**
   * Using ipify service to get user IP for location fetching.
   * @returns user's IP in string.
   */
  private async getIP(): Promise<string> {
    return (await fetch('https://api.ipify.org')).text();
  }

  /**
   * Uses user's IP with ip-api service to get user location.
   * @returns object with user location data.
   */
  private async getLocation(): Promise<Geolocate> {
    return (await fetch('http://ip-api.com/json/' + this.ip)).json();
  }

  /**
   * Fetches weather 7 days worth of data from open-meteo.
   * @param lat User's latitude.
   * @param long User's Longitude.
   * @returns Object containing relevant weather data.
   */
  private async getWeather(lat: number, long: number): Promise<WeatherData> {
    return (
      await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7`
      )
    ).json();
  }

  /**
   * Takes in weather code number and returns the descriptive string.
   * @param code The weather code value.
   * @returns A brief description relating to the weather code.
   */
  weatherCodeToString(code: number): string | null {
    type Key = keyof typeof codes;

    const codeAsString: string = code.toString();

    if (codeAsString in codes) {
      const stringCode = codes[codeAsString as Key];

      if (this.isDay()) return stringCode.day;
      else return stringCode.night;
    }
    return null;
  }

  /**
   * Gets today's date from system.
   * @returns Today's date in object as numbers.
   */
  getDate(): NumberDate {
    const day: number = this.date.getUTCDate();
    const month: number = this.date.getUTCMonth() + 1;
    const year: number = this.date.getUTCFullYear();

    return { day, month, year };
  }

  /**
   * Gets current time from system.
   * @returns Current time in object as numbers.
   */
  getTime(): NumberTime {
    const hours: number = this.date.getHours();
    const minutes: number = this.date.getMinutes();

    return { hours, minutes };
  }

  /**
   * Checks if current time is day or night.
   * @returns Boolean value representing whether it is day or night.
   */
  isDay(): boolean {
    return this.getTime().hours < 7;
  }

  /**
   * Gets all the weather data for one specific date.
   * @param date The target date.
   * @returns An array containing all the weather day for provided date.
   */
  getWeatherOnDate(date: NumberDate): TimeWeather[] {
    const dateString: string = `${date.year}-${SDC(date.month)}-${SDC(
      date.day
    )}`;

    const daysWeather: TimeWeather[] = [];

    const indices: DoubleIndex = this.getDateIndex(dateString);

    if (indices.end && indices.start) {
      for (let index = indices.start; index <= indices.end; index++) {
        const tempWeather: TimeWeather | null = this.getFromIndex(index);
        if (tempWeather) daysWeather.push(tempWeather);
      }
    }

    return daysWeather;
  }

  /**
   * Gets all relevant data from a specific date-time index.
   * @param index The index relating to the date and time of a group of data.
   * @returns An object containing the relevant data for that index.
   */
  private getFromIndex(index: number): TimeWeather | null {
    if (this.data) {
      const hourly = this.data.hourly;
      const time: string = hourly.time[index].substring(11, 16);
      const temperature: number = hourly.temperature_2m[index];
      const precipitationProb: number = hourly.precipitation_probability[index];
      const weatherCode: number = hourly.weather_code[index];
      const windSpeed: number = hourly.wind_speed_10m[index];

      return { time, temperature, precipitationProb, weatherCode, windSpeed };
    } else return null;
  }

  /**
   * Gets the index of a date string for locating relevant weather data.
   * @param date The date string being targeted.
   * @returns An object containing the start and end point of the dates string indices.
   */
  private getDateIndex(date: string): DoubleIndex {
    let start: number | null = null;
    let end: number | null = null;

    if (this.data) {
      const timeArray: string[] = this.data.hourly.time;
      for (let index = 0; index < timeArray.length; index++) {
        if (timeArray[index].substring(0, 10) === date) {
          if (start) {
            end = index;
          } else {
            start = index;
          }
        }
      }
    }
    return { start, end };
  }
}

new Weather();

/**
 * Single Digit Check (SDC), checks if a number is single digit and adds a 0 at the start if a single digit.
 * @param number the number to be converted to string.
 * @returns The number as string with appropriate formatting.
 */
export const SDC = (number: number): string =>
  number < 10 ? '0' + number : number.toString();
