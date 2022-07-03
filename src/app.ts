import express, {Express, NextFunction, Request, Response} from "express";
import {debug} from "util";
import DevicesService from "./services/devices.service";
import DevicesRepository from "./repositories/devices.repository";
import EntitlementService from "./services/entitlement.service";
import bodyParser from "body-parser";
import {Device} from "./models/devices.model";

class App {
    private app: Express

    private readonly port: number

    private readonly mongodb_username: string
    private readonly mongodb_password: string
    private readonly mongodb_host: string
    private readonly mongodb_port: string
    private readonly mongodb_database: string

    private readonly devicesService: DevicesService
    private readonly entitlementService: EntitlementService

    constructor() {
        this.app = express()

        this.port = process.env.PORT as unknown as number;

        this.mongodb_username = process.env.MONGODB_USERNAME as string;
        this.mongodb_password = process.env.MONGODB_PASSWORD as string;
        this.mongodb_host = process.env.MONGODB_HOST as string;
        this.mongodb_port = process.env.MONGODB_PORT as string;
        this.mongodb_database = process.env.MONGODB_DATABASE as string;

        const devicesRepository = new DevicesRepository(this.mongodb_username, this.mongodb_password, this.mongodb_host,
            this.mongodb_port, this.mongodb_database)

        this.devicesService = new DevicesService(devicesRepository)
        this.entitlementService = new EntitlementService()

        return this
    }

    registerRoutes() {
        this.app.use(bodyParser.json())

        // Find all devices a user has
        this.app.get("/users/:userId/devices", async (req: Request, res: Response) => {
            const { userId } = req.params

            await this.devicesService.getAllDevicesForUser(userId)
                .then((devices) => res.json(devices))
                .catch(error => res.json({ error: error.message }));
        });

        // Find a specific device owned by a user
        this.app.get("/users/:userId/devices/:id", async (req: Request, res: Response) => {
            const { userId, id } = req.params

            await this.devicesService.getDeviceById(userId, id)
                .then((device) => {
                    if (device == null) {
                        res.status(404)
                    }

                    res.json(device)
                })
                .catch(error => res.json({ error: error.message }));
        });

        // Create a new device for a user
        this.app.post("/users/:userId/devices", async (req: Request, res: Response) => {
            const { userId } = req.params
            const { name } = req.body

            const device = new Device();
            device.userId = userId;
            device.name = name;
            device.playable = true;

            await this.devicesService.registerDevice(device)
                .then(() => res.status(201).send("ok"))
                .catch(error => res.status(202).json({ error: error.message }));
        });

        return this
    }

    registerGenericRoutes() {
        // Handling not found
        this.app.use((req: Request, res: Response, _: NextFunction) => {
            res.status(404).send("Resource not found")
        })

        // Handling HTTP error
        this.app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
            console.error(err.stack)
            res.status(500).send("Internal server error")
        })

        return this
    }

    run() {
        const server = this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`);
        });

        process.on("SIGTERM", () => {
            debug("SIGTERM signal received: closing HTTP server")
            server.close(() => {
                debug("HTTP server closed")
            })
        })
    }
}

export default App