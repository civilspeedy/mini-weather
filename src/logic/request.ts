import { useEffect, useState } from 'react';

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

const useRequest = () => {
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
type CoreData = {
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
  } else return null;
}

type NowWeather = {
  dateTime: DateTime;
  temperature: number;
  rainChance: number;
  weather_code: number;
  windSpeed: number;
};

function nowWeather() {
  const data: CoreData | null = getCore();

  if (data !== null) {
    const day: number = date.getDay();
    const month: number = date.getMonth();
    const year: number = date.getFullYear();

    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();

    const now: DateTime = {
      date: { day, month, year },
      time: { hours, minutes },
    };
  }
}

nowWeather();
