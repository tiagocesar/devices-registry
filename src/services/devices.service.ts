import DevicesRepository from "../repositories/devices.repository";
import { Device } from "../models/devices.model";
import EntitlementService from "./entitlement.service";

class DevicesService {
  constructor(
    private entitlementService: EntitlementService,
    private devicesRepo: DevicesRepository
  ) {}

  async getAllDevicesForUser(userId: string): Promise<Device[]> {
    return this.devicesRepo.getDevicesForUser(userId);
  }

  async getDeviceById(userid: string, id: string): Promise<Device | undefined> {
    const device = await this.devicesRepo.getDeviceById(userid, id);

    if (device.length > 0) {
      return device[0];
    }
  }

  async registerDevice(device: Device): Promise<boolean> {
    const registeredDevices = await this.devicesRepo.getActiveDevicesCount(
      device.userId
    );
    const allowedDevices = await this.entitlementService.checkAvailability(
      device.userId
    );

    if (registeredDevices >= allowedDevices) {
      // Device shouldn't be able to stream
      device.playable = false;
    }

    return await this.devicesRepo.registerDevice(device);
  }

  updateDevice(id: string, playable: boolean) {}

  deleteDevice(id: string) {}
}

export default DevicesService;
