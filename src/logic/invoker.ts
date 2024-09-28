import { invoke } from '@tauri-apps/api';

export function log(message: string | any, error: boolean) {
    let parsedMsg = '';
    if (typeof message !== 'string') {
        parsedMsg = JSON.stringify(message);
    } else {
        parsedMsg = message;
    }

    try {
        if (error) {
            invoke('error_log', { msg: parsedMsg });
        } else {
            invoke('log', { msg: parsedMsg });
        }
    } catch (e) {
        // this probably will go horrendously wrong if ever used but I thought it was funny
        log(
            'Printing something to log, message: ' +
                parsedMsg +
                ', TS error: ' +
                e,
            true
        );
    }
}
