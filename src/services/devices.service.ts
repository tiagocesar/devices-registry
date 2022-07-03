import DevicesRepository from "../repositories/devices.repository"
import {Device} from "../models/devices.model";

class DevicesService {
    constructor(private devicesRepo: DevicesRepository) {
    }

    async getAllDevicesForUser(userId: string): Promise<Device[]> {
        return await this.devicesRepo.getDevicesForUser(userId);
    }

    async getDeviceById(userid: string, id: string): Promise<Device | undefined> {
        const device = await this.devicesRepo.getDeviceById(userid, id);

        if (device.length > 0) {
            return device[0];
        }
    }

    async registerDevice(device: Device): Promise<boolean> {
        const registeredDevices = await this.devicesRepo.getActiveDevicesCount(device.userId);
        const allowedDevices = 2;

        if (registeredDevices >= allowedDevices) {
            throw new Error("This user can't register more devices");
        }

        return await this.devicesRepo.registerDevice(device);

    }

    updateDevice(id: string, playable: boolean) {}

    deleteDevice(id: string) {}
}

export default DevicesService