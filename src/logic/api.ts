import { LocationData, WeatherData } from './types';

const getIP = async (): Promise<string> =>
    (await fetch('https://api.ipify.org')).text();

async function getLoc(): Promise<{
    lat: number;
    long: number;
}> {
    const data: Promise<LocationData> = (
        await fetch('http://ip-api.com/json/' + (await getIP()))
    ).json();
    return { lat: (await data).lat, long: (await data).lon };
}

export async function getWeather(): Promise<WeatherData> {
    const latLong = await getLoc();
    return (
        await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latLong.lat}&longitude=${latLong.long}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7`
        )
    ).json();
}
