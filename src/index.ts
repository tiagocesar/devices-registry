import App from "./app";
import dotenv from "dotenv"

dotenv.config()

new App()
    .registerRoutes()
    .registerGenericRoutes() // For 404 and 500
    .run()
