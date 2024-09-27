import template from '../assets/template.json';

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

export type Weather = keyof typeof template;
