export interface IDevice {
    id: string;
    userId: string;
    name: string;
    playable: boolean;
}

export class Device implements IDevice {
    id: string = "";
    userId: string = "";
    name: string = "";
    playable: boolean = false;
}