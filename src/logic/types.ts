import template from '../assets/json/template.json';

export type LocationData = {
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    query: string;
};

export type TimeWeather = {
    time: string;
    temperature: number;
    precipitationProb: number;
    weatherCode: string;
    windSpeed: number;
};

export type Weather = typeof template;

export type Hourly = {
    time: string[];
    temperature_2m: Int8Array;
    precipitation_probability: Int8Array;
    weather_code: Int8Array;
    wind_speed_10m: Int8Array;
};
