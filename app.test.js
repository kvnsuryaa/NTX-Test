const request = require("supertest");
const { app: server } = require("./server");

describe("GET /api/data/getData", () => {
  describe("Have No Token", () => {
    test("Should respond with a 403 status code", async () => {
      const resp = await request(server).get("/api/data/getData?value=US");
      expect(resp.statusCode).toBe(403);
    });
  });

  describe("Using Token but have no access", () => {
    test("Should respond with a 403 status code", async () => {
      const resp = await request(server).get("/api/data/getData?value=US").set({
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJ3b3JrVHlwZSI6IldGSCIsImlhdCI6MTY5NzUzNTUxMX0.vL554jnysu25ja3vmUAGUysOn9JimfIfzJ2tCthnvVE",
      });
      expect(resp.statusCode).toBe(403);
    });
  });

  describe("Using Token that have access", () => {
    test("Should respond with a 403 status code", async () => {
      const resp = await request(server).get("/api/data/getData?value=US").set({
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ3b3JrVHlwZSI6IldGTyIsImlhdCI6MTY5NzUzNTA3N30.U5EtCfsDd-LKbpY_BDD1-V3t4UjGztNwTSYMrDETQMM",
      });
      expect(resp.statusCode).toBe(200);
    });
  });
});
