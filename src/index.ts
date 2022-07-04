import App from "./app";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  (await new App().configureDependencies())
    .registerRoutes()
    .registerGenericRoutes() // For 404 and 500
    .run();
})();
