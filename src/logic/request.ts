import { useEffect, useState } from 'react';
import codes from '../assets/weather_codes.json';

const date: globalThis.Date = new Date();

/**
 * Data type for data received from open-meteo for easier manipulation.
 */
type WeatherData = {
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

export const useRequest = () => {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const sendRequest = async () => {
      const request = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=1'
      );

      const response: string = await request.text();
      const json: WeatherData = JSON.parse(response);
      const timeArray = json.hourly.time;

      for (let i = 0; i < timeArray.length; i++) {
        const originalDateTime = timeArray[i];

        if (typeof originalDateTime === 'string') {
          json.hourly.time[i] = stringToDate(originalDateTime);
        }
      }
      setData(json);
    };

    const timer = setInterval(() => sendRequest(), 3600000);
    return () => clearInterval(timer);
  }, []);

  return data;
};

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
 * A custom hook to request and return a main weather data at a 1 hour interval.
 * @returns Weather data or null if API failed.
 */
function getCore(): CoreData | null {
  const data: WeatherData | null = useRequest();
  if (data) {
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
  } else return null;
}

export type Weather = {
  temperature: number;
  rainChance: number;
  weather_code: number;
  windSpeed: number;
};

function getTodayAndNow(): DateTime {
  const day: number = date.getDay();
  const month: number = date.getMonth();
  const year: number = date.getFullYear();

  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();

  return {
    date: { day, month, year },
    time: { hours, minutes },
  };
}

// don't forget to test
function nowWeather(): Weather | null {
  const data: CoreData | null = getCore();

  if (data) {
    const now: DateTime = getTodayAndNow();
    const index: number | null = getIndex(
      now,
      data.dateTime,
      0,
      data.dateTime.length
    );
    return weatherFromIndex(index, data);
  }
  return null;
}

function weatherFromIndex(
  index: number | null,
  data: CoreData | null
): Weather | null {
  if (index && data) {
    const temperature: number = data.temperature[index];
    const rainChance: number = data.rainChance[index];
    const weather_code: number = data.weather_code[index];
    const windSpeed: number = data.windSpeed[index];

    return { temperature, rainChance, weather_code, windSpeed };
  }
  return null;
}

function checkIfDTSame(valueOne: DateTime, valueTwo: DateTime): boolean {
  const day: boolean = valueOne.date.day === valueTwo.date.day;
  const month: boolean = valueOne.date.month === valueTwo.date.month;
  const year: boolean = valueOne.date.year === valueTwo.date.year;

  const hours: boolean = valueOne.time.hours === valueTwo.time.hours;
  const minutes: boolean = valueOne.time.minutes === valueTwo.time.minutes;

  return (((day === month) === year) === hours) === minutes;
}

function checkIfDTMore(valueOne: DateTime, valueTwo: DateTime): boolean {
  const day: boolean = valueOne.date.day > valueTwo.date.day;
  const month: boolean = valueOne.date.month > valueTwo.date.month;
  const year: boolean = valueOne.date.year > valueTwo.date.year;

  const hours: boolean = valueOne.time.hours > valueTwo.time.hours;
  const minutes: boolean = valueOne.time.minutes > valueTwo.time.minutes;

  return (((day === month) === year) === hours) === minutes;
}

function getIndex(
  target: DateTime,
  array: DateTime[],
  upper: number,
  lower: number
): number | null {
  if (array.length === 1) return 1;
  else {
    const midpoint: number = Math.round((lower + upper) / 2);
    if (checkIfDTSame(array[midpoint], target)) return midpoint;

    if (checkIfDTMore(array[midpoint], target)) {
      return getIndex(target, array, lower, midpoint - 1);
    }

    if (checkIfDTMore(target, array[midpoint])) {
      return getIndex(target, array, midpoint + 1, upper);
    }
  }
  return null;
}

export function getFuture(amount: number): Weather[] {
  let dateConstructor = new Date();
  const dates: DateTime[] = [];
  const data: CoreData | null = getCore();
  const weather: Weather[] = [];

  if (data) {
    for (let i = 1; i <= amount; i++) {
      dateConstructor.setDate(dateConstructor.getDate() + i);
      let dateString: string = dateConstructor.toISOString();
      dateString = dateString.substring(0, 16);

      const converted: DateTime = stringToDate(dateString);

      dates.push(converted);
    }

    for (let date of dates) {
      const index = getIndex(date, data.dateTime, 0, data.dateTime.length);
      const tempWeather: Weather | null = weatherFromIndex(index, data);
      if (tempWeather) weather.push(tempWeather);
    }
  }
  return weather;
}

type CodesKey = keyof typeof codes;

function weatherCodeTranslator(code: CodesKey): string {
  const now: DateTime = getTodayAndNow();

  if (now.time.hours >= 7) {
    return codes[code].night;
  } else {
    return codes[code].day;
  }
}
