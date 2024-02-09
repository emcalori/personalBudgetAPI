import request from "supertest";
import router, { Envelope, envelopes } from "./envelopes";
import { app } from "./app";

const envelopeMock = jest.mock("./envelopes", () => ({
  __esModule: true,
  envelopes: [{ name: "Test", budget: 10, id: "0" } as Envelope],
}));

jest.mock("uuid", () => ({ v4: () => "2" }));

describe("envelopes.ts", () => {
  it("should return array of envelopes (GET /)", async () => {
    envelopes.push({ name: "Test", budget: 10, id: "1" } as Envelope);
    const response = await request(app).get("/envelopes");
    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it("should return new envelope assigned (POST /)", async () => {
    const response = await request(app)
      .post("/envelopes")
      .set("Accept", "application/json")
      .send({
        name: "Test2",
        budget: 75,
      });
    const { body, statusCode } = response;

    expect(statusCode).toBe(201);
    expect(body).toEqual({
      name: "Test2",
      budget: 75,
      id: "2",
    });
  });

  it("should return 400 error (POST /)", async () => {
    const response = await request(app)
      .post("/envelopes")
      .set("Accept", "application/json")
      .send({
        name: "Test",
        money: 75,
      });
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
  });

  it("should return envelope with id 1 (GET /:id)", async () => {
    const response = await request(app).get("/envelopes/1");
    const { body, statusCode } = response;

    expect(statusCode).toBe(200);
    expect(body).toEqual([{ name: "Test", budget: 10, id: "1" }]);
  });

  it("should return 404 error (GET /:id)", async () => {
    const response = await request(app).get("/envelopes/50");
    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });
});
