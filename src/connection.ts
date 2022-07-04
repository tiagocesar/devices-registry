import { MongoMemoryServer } from "mongodb-memory-server";

export class ConnectionSelector {
  async getDB(): Promise<string> {
    if (process.env.NODE_ENV === "test") {
      return await this.getTestDataBaseURL();
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

  async getTestDataBaseURL(): Promise<string> {
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbName: "myproject",
      },
    });

    return mongod.getUri();
  }
}
