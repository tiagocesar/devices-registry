import { MongoMemoryServer } from "mongodb-memory-server";

export class ConnectionSelector {
  getDB(): string {
    if (process.env.NODE_ENV === "test") {
      this.getTestDataBaseURL().then((url) => {
        return url;
      });
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

  async getTestDataBaseURL() {
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbName: "myproject",
      },
    });

    return mongod.getUri();
  }
}
