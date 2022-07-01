import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});