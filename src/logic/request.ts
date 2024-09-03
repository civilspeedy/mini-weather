export async function requestWeather(): Promise<object> {
    const request = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m'
    );
    const response = await request.text();

    const obj: object = JSON.parse(response);

    return obj;
}
