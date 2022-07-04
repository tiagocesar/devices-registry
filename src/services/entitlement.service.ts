import { EntitlementConverter } from "../models/entitlement.model";

class EntitlementService {
  private readonly serviceUrl: string;

  constructor(serviceUrl: string) {
    if (serviceUrl === undefined || serviceUrl.length === 0) {
      throw new Error("No URL provided for the Entitlement Service");
    }

    this.serviceUrl = serviceUrl;
  }

  async checkAvailability(userId: string): Promise<number> {
    const entitlements = await this.callService();

    const found = entitlements.find(
      (entitlement) => entitlement.userId === userId
    );

    return found ? found.entitlements.devices.max_devices : 0;
  }

  async callService(): Promise<EntitlementConverter[]> {
    const res = await fetch(this.serviceUrl);
    return (await res.json()) as EntitlementConverter[];
  }
}

export default EntitlementService;
