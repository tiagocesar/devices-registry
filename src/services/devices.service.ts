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
    const userCanRegisterPlayableDevice =
      await this.userCanRegisterPlayableDevice(device.userId);

    if (!userCanRegisterPlayableDevice) {
      // Device shouldn't be able to stream
      device.playable = false;
    }

    return await this.devicesRepo.registerDevice(device);
  }

  async userCanRegisterPlayableDevice(userId: string): Promise<boolean> {
    const registeredDevices = await this.devicesRepo.getActiveDevicesCount(
      userId
    );
    const allowedDevices = await this.entitlementService.checkAvailability(
      userId
    );

    return registeredDevices < allowedDevices;
  }

  async updateDevice(
    userId: string,
    id: string,
    name: string,
    playable: boolean
  ) {
    if (playable) {
      // Marking devices as playable requires a check for entitlement
      const userCanRegisterPlayableDevice =
        await this.userCanRegisterPlayableDevice(userId);

      if (!userCanRegisterPlayableDevice) {
        throw new Error(`No entitlements available for user ${userId}`);
      }
    }

    const device = await this.getDeviceById(userId, id);

    if (device === undefined) {
      throw new Error(`No device found,  id ${id}`);
    }

    if (name !== undefined) {
      device.name = name;
    }

    if (playable !== undefined) {
      device.playable = playable;
    }

    return await this.devicesRepo.updateDevice(id, device);
  }

  deleteDevice(id: string) {}
}

export default DevicesService;
