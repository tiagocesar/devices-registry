import request from "supertest";
import App from "./app";
import { Express } from "express";

describe("Get Devices", () => {
  let app: Express;

  beforeEach(async () => {
    app = (await new App().configureDependencies())
      .registerRoutes()
      .registerGenericRoutes().app;
  });

  it("get devices should be an empty array", async () => {
    const res = await request(app).get("/users/123/devices");
    expect(res.body).toEqual([]);
    expect(res.status).toBe(200);
  });
});
