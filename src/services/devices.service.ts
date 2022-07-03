import DevicesRepository from "../repositories/devices.repository"
import Device from "../models/devices.model";

class DevicesService {
    constructor(private _devicesRepo: DevicesRepository) {
    }

    registerDevice(device: Device) {}

    updateDevice(device: Device) {}
}

export default DevicesService