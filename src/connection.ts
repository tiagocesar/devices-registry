import { MongoMemoryServer } from "mongodb-memory-server";

export class ConnectionSelector {
  getDB(): string {
    let uri: string = "";
    if (process.env.NODE_ENV === "test") {
      return this.getTestDataBaseURL();
    }

    return this.getDatabaseURL();
  }

  getDatabaseURL(): string {
    const user = process.env.MONGODB_USERNAME as string;
    const password = process.env.MONGODB_PASSWORD as string;
    const host = process.env.MONGODB_HOST as string;
    const port = process.env.MONGODB_PORT as string;

    return `mongodb://${user}:${password}@${host}:${port}/`;
  }

  getTestDataBaseURL() {
    const mongod = new MongoMemoryServer({
      instance: {
        dbName: "myproject",
      },
    });

    return mongod.getUri();
  }
}
