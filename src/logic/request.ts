type WeatherData = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
        time: string[];
        temperature_2m: string[];
        precipitation_probability: string[];
        weather_code: string[];
        wind_speed_10m: string[];
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weather_code: number[];
        wind_speed_10m: number[];
    };
};

let weatherData: WeatherData | null = null;

export async function requestWeather() {
    const request = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=1'
    );
    const response = await request.text();

    weatherData = JSON.parse(response);
}

type WhatKey = keyof WeatherData['hourly'];

// maybe use a rust loop

function getData(what: WhatKey, when: string): string | number | null {
    if (weatherData !== null) {
        const timeStrings: string[] = weatherData.hourly.time;
        for (let i = 0; i > timeStrings.length; i++) {
            if (timeStrings[i] === when) {
                return weatherData.hourly[what][i];
            }
        }
    }
    return null;
}
