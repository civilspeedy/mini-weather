import { log } from './invoker';

export class Runtime {
    private time: number;
    private startTime: number;
    private stopTime: number;

    constructor() {
        this.time = 0;
        this.startTime = 0;
        this.stopTime = 0;
    }

    startLog() {
        this.startTime = performance.now();
    }

    stopLog() {
        this.stopTime = performance.now();
        this.time = this.stopTime - this.startTime;
        log(this.time + 's', false);
    }
}
