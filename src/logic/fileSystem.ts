import { invoke } from '@tauri-apps/api';
import { writeTextFile } from '@tauri-apps/api/fs';

export async function storeWeather() {
    invoke('log', { msg: 'test' });
    try {
        await writeTextFile('../src/assets/json/test.txt', 'test');
        invoke('log', { msg: 'File written successfully' });
    } catch (error) {
        invoke('log', { msg: 'Error writing file:' + error });
    }
}
