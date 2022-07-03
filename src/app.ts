import AppInitializer from "./app.initializer";

const port = 8000;

new AppInitializer()
    .registerRoutes()
    .registerGenericRoutes() // For 404 and 500
    .run(port)
