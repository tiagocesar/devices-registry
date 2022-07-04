import express, { NextFunction, Request, Response } from "express";
import { debug } from "util";
import DevicesService from "./services/devices.service";
import DevicesRepository from "./repositories/devices.repository";
import EntitlementService from "./services/entitlement.service";
import bodyParser from "body-parser";
import { Device } from "./models/devices.model";
import { ConnectionSelector } from "./connection";

class App {
  public app = express();

  private readonly port: number;

  private devicesService: DevicesService | undefined;

  constructor() {
    this.port = process.env.PORT as unknown as number;

    return this;
  }

  async configureDependencies() {
    const dbUri = await new ConnectionSelector().getDB();
    const devicesRepository = new DevicesRepository(dbUri);

    const entitlement_url = process.env.ENTITLEMENT_URL as string;

    const entitlementService = new EntitlementService(entitlement_url);

    this.devicesService = new DevicesService(
      entitlementService,
      devicesRepository
    );

    return this;
  }

  registerRoutes() {
    if (this.devicesService === undefined) {
      throw new Error("Service registration failed for DevicesService");
    }

    const devicesService = this.devicesService;

    // To populate the body of POST/PUT/PATCH requests
    this.app.use(bodyParser.json());

    // Finds all devices a user has
    this.app.get(
      "/users/:userId/devices",
      async (req: Request, res: Response) => {
        const { userId } = req.params;

        await devicesService
          .getAllDevicesForUser(userId)
          .then((devices) => res.json(devices))
          .catch((error) => res.json({ error: error.message }));
      }
    );

    // Finds a specific device owned by a user
    this.app.get(
      "/users/:userId/devices/:id",
      async (req: Request, res: Response) => {
        const { userId, id } = req.params;

        await devicesService
          .getDeviceById(userId, id)
          .then((device) => {
            if (device === null) {
              res.status(404);
            }

            res.json(device);
          })
          .catch((error) => res.json({ error: error.message }));
      }
    );

    // Creates a new device for a user
    this.app.post(
      "/users/:userId/devices",
      async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { name } = req.body;

        const device = new Device();
        device.userId = userId;
        device.name = name;
        device.playable = true;

        await devicesService
          .registerDevice(device)
          .then(() => res.status(201).send())
          .catch((error) => res.status(202).json({ error: error.message }));
      }
    );

    // Updates a device, like marking it as playable
    this.app.patch(
      "/users/:userId/devices/:id/",
      async (req: Request, res: Response) => {
        const { userId, id } = req.params;
        const { name, playable } = req.body;

        await devicesService
          .updateDevice(userId, id, name, playable)
          .then(() => res.status(200).send())
          .catch((error) => res.status(202).json({ error: error.message }));
      }
    );

    // Deletes a device, use with caution
    this.app.delete(
      "/users/:userId/devices/:id/",
      async (req: Request, res: Response) => {
        const { userId, id } = req.params;

        await devicesService
          .deleteDevice(userId, id)
          .then(() => res.status(200).send())
          .catch((error) => res.status(202).json({ error: error.message }));
      }
    );

    return this;
  }

  registerGenericRoutes() {
    // Handling not found
    this.app.use((req: Request, res: Response, _: NextFunction) => {
      res.status(404).send("Resource not found");
    });

    // Handling HTTP error
    this.app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
      console.error(err.stack);
      res.status(500).send("Internal server error");
    });

    return this;
  }

  run() {
    const server = this.app.listen(this.port, () => {
      console.log(
        `⚡️[server]: Server is running at https://localhost:${this.port}`
      );
    });

    process.on("SIGTERM", () => {
      debug("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        debug("HTTP server closed");
      });
    });
  }
}

export default App;
