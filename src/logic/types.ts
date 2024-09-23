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

export type WeatherData = {
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
  hourly: Hourly
};

export type DoubleIndex = {
  start: number | null;
  end: number | null;
};

export type TimeWeather = {
  time: string;
  temperature: number;
  precipitationProb: number;
  weatherCode: string;
  windSpeed: number;
};

export type Hourly =  {
  time: string[];
  temperature_2m: Int8Array;
  precipitation_probability: Int8Array;
  weather_code: Int8Array;
  wind_speed_10m: Int8Array;
}