import { BaseDirectory, exists, writeTextFile } from '@tauri-apps/api/fs';
import { log } from './invoker';

export async function writeWeatherData(data: object) {
    const FILE = 'json/data.json';
    try {
        const doesExist = await exists(FILE);
        log(doesExist, false);
        await writeTextFile(FILE, JSON.stringify(data), {
            dir: BaseDirectory.AppData,
        });
        log('Saved file', false);
    } catch (e) {
        log(e, true);
    }
}
