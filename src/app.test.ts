import request from "supertest";
import App from "./app";

(async () => {
  const app = (await new App().configureDependencies())
    .registerRoutes()
    .registerGenericRoutes().app;

  describe("Get Devices", () => {
    it("get devices should be an empty array", async () => {
      const res = await request(app).get("/users/123/devices");
      // expect(res.body).toHaveProperty("users");
      expect(res.body).toEqual([]);
      expect(res.status).toBe(200);
    });
    // it("get users after inserting one user should be an array with one element", async () => {
    //   const insertedResult = await request(app)
    //     .post("/users")
    //     .send({ name: "Amin", email: "amin@gmail.com" });
    //   const res = await request(app).get("/users");
    //   expect(res.body.users.length).toBe(1);
    //   expect(res.body.users[0].name).toBe("Amin");
    //   expect(res.status).toBe(200);
    // });
  });
})();
