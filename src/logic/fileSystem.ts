import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { log } from './invoker';
import { Weather } from './types';

export async function writeWeatherData(data: Weather) {
    // something
    try {
        await writeTextFile('json/data.json', JSON.stringify(data));
        log('Saved file', false);
    } catch (e) {
        log('Failed to save file: ' + e, true);
    }
}
