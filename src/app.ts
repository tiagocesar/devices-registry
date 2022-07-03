import express, {Express, NextFunction, Request, Response} from "express";
import {debug} from "util";
import DevicesService from "./services/devices.service";
import DevicesRepository from "./repositories/devices.repository";
import EntitlementService from "./services/entitlement.service";

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
        this.app.get('/', (req: Request, res: Response) => {
            res.send("Express + TypeScript server");
        });

        this.app.get("/devices/:userId", async (req: Request, res: Response) => {
            const { userId } = req.params

            const devices = this.devicesService.getAllDevicesForUser(userId)

            res.send(devices)
        });

        return this
    }

    registerGenericRoutes() {
        // Handling not found
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send("Resource not found")
        })

        // Handling HTTP error
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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