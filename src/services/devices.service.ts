import DevicesRepository from "../repositories/devices.repository"

class DevicesService {
    constructor(private devicesRepo: DevicesRepository) {
    }

    async getAllDevicesForUser(userId: string): Promise<IDevice[]> {
        return await this.devicesRepo.getDevicesForUser(userId)
    }

    // getDeviceById(id: string): IDevice {return new IDevice();}

    registerDevice(device: IDevice) {}

    updateDevice(id: string, playable: boolean) {}

    deleteDevice(id: string) {}
}

export default DevicesService