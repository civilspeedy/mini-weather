import {
  DoubleIndex,
  Geolocate,
  NumberDate,
  NumberTime,
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

      this.getWeather(lat, long);

      console.log(this.weatherCodeToString(1));
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

  getWeatherOnDate(date: NumberDate) {
    const dateString: string = `${date.year}-${SDC(date.month)}-${SDC(
      date.day
    )}`;
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
