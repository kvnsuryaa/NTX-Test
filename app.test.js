const request = require("supertest");
const server = require("./server");

describe("GET /api/data/getData", () => {
  describe("Have No Token", () => {
    test("Should respond with a 403 status code", async () => {
      const resp = await request(server).get("api/data/getData");
      expect(resp.statusCode).toBe(403);
    });
  });

  describe("Using Token but have no access", () => {
    test("Should respond with a 403 status code", async () => {
      const resp = await request(server).get("api/data/getData");
      expect(resp.statusCode).toBe(403);
    });
  });

  describe("Using Token that have access", () => {});
});
