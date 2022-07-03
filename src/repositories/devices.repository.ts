import Device from "../models/devices.model"

export class DevicesRepository {
    constructor(private _host: string, private _user: string, private _password: string) {
    }

    getDevicesForUser(userId: string): Array<Device> {
        return new Array<Device>()
    }

    registerDevice(device: Device) {}

    updateDevice(device: Device) {}
}

export default DevicesRepository
