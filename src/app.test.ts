import request from "supertest";
import App from "./app";
import { Express } from "express";

const user = "c0b8584c-97e3-4561-b8fc-58797b1f4c6d"; // Real case from the entitlements JSON - this user has 2 entitlements

describe("Get Devices", () => {
  let app: Express;

  beforeAll(async () => {
    app = (await new App().configureDependencies())
      .registerRoutes()
      .registerGenericRoutes().app;
  });

  it("get devices should be an empty array", async () => {
    const res = await request(app).get("/users/123/devices");
    expect(res.body).toEqual([]);
    expect(res.status).toBe(200);
  });

  it("get devices after inserting one device should be an array with one element", async () => {
    const insertedResult = await request(app)
      .post("/users/123/devices")
      .send({ name: "iPhone" });
    const res = await request(app).get("/users/123/devices");
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("iPhone");
    expect(res.status).toBe(200);
  });

  it("insert devices until no more entitlements are available", async () => {
    // Insert 3 devices
    await request(app).post(`/users/${user}/devices`).send({ name: "iPhone" });
    await request(app).post(`/users/${user}/devices`).send({ name: "iPad" });
    await request(app).post(`/users/${user}/devices`).send({ name: "Android" });

    const res = await request(app).get(`/users/${user}/devices`);
    expect(res.body.length).toBe(3);
    expect(res.body[0].name).toBe("iPhone");
    expect(res.body[0].playable).toBe(true);
    expect(res.body[1].name).toBe("iPad");
    expect(res.body[1].playable).toBe(true);
    expect(res.body[2].name).toBe("Android");
    expect(res.body[2].playable).toBe(false);
    expect(res.status).toBe(200);
  });

  it("try to enable a device to be playable with no entitlements left should fail", async () => {
    // Insert 3 devices
    await request(app).post(`/users/${user}/devices`).send({ name: "iPhone" });
    await request(app).post(`/users/${user}/devices`).send({ name: "iPad" });
    await request(app).post(`/users/${user}/devices`).send({ name: "Android" });

    const res1 = await request(app).get(`/users/${user}/devices`);
    expect(res1.body.length).toBe(3);
    const device = res1.body[2];

    const res2 = await request(app)
      .patch(`/users/${user}/devices/${device._id}`)
      .send({ playable: true });
    expect(res2.status).toBe(202);
  });
});
