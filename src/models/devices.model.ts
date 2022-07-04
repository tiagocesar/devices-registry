export interface IDevice {
  userId: string;
  name: string;
  playable: boolean;
}

export class Device implements IDevice {
  userId: string = "";
  name: string = "";
  playable: boolean = false;
}
