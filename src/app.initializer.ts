import express, {Express, NextFunction, Request, Response} from "express";
import {debug} from "util";

class AppInitializer {
    private _app: Express

    constructor() {
        this._app = express()
    }

    registerRoutes() {
        this._app.get('/', (req: Request, res: Response) => {
            res.send("Express + TypeScript server");
        });

        return this
    }

    registerGenericRoutes() {
        // Handling not found
        this._app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send("Resource not found")
        })

        // Handling HTTP error
        this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack)
            res.status(500).send("Internal server error")
        })

        return this
    }

    run(port: number) {
        const server = this._app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
        });

        process.on("SIGTERM", () => {
            debug("SIGTERM signal received: closing HTTP server")
            server.close(() => {
                debug("HTTP server closed")
            })
        })
    }
}

export default AppInitializer