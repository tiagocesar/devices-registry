import AppInitializer from "./app.initializer";
import dotenv from "dotenv"

dotenv.config()

let port = process.env.PORT as unknown as number;

if (port == undefined) {
    console.error("Invalid value for environment variable PORT")
    process.exit(1)
}

new AppInitializer()
    .registerRoutes()
    .registerGenericRoutes() // For 404 and 500
    .run(port)
