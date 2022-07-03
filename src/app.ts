import express, {Express, NextFunction, Request, Response} from "express";
import {debug} from "util";

const app: Express = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.send("Express + TypeScript server");
});

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

process.on("SIGTERM", () => {
    debug("SIGTERM signal received: closing HTTP server")
    server.close(() => {
        debug("HTTP server closed")
    })
})

// Handling not found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Resource not found")
})

// Handling HTTP error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).send("Internal server error")
})
