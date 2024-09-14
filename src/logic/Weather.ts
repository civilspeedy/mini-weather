import { Geolocate, WeatherData } from './types';

class Weather {
  private data: WeatherData | undefined;
  private ip: string | undefined;
  private location: Geolocate | undefined;

  public constructor() {
    this.init();
  }

  private async init() {
    try {
      this.ip = await this.getIP();
      this.location = await this.getLocation();

      const lat: number = this.location.lat;
      const long: number = this.location.lon;

      this.data = await this.getWeather(lat, long);
      console.log(
        'ip:',
        this.ip,
        '\nloc: ',
        this.location,
        '\ndata: ',
        this.data
      );
    } catch (e) {
      console.error('err: ', e);
    }
  }
  private async getIP(): Promise<string> {
    return (await fetch('https://api.ipify.org')).text();
  }

  private async getLocation(): Promise<Geolocate> {
    return (await fetch('http://ip-api.com/json/' + this.ip)).json();
  }

  private async getWeather(lat: number, long: number): Promise<WeatherData> {
    return (
      await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&forecast_days=7`
      )
    ).json();
  }
}

new Weather();
