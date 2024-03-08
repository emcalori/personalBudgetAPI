import request from "supertest";
import router, { Envelope, envelopes } from "./envelopes";
import { app } from "./app";

const envelopeMock = jest.mock("./envelopes", () => ({
  __esModule: true,
  envelopes: [],
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

  it("should successfully transfer money from envelope 1 to envelope 2 (PATCH /transfer)", async () => {
    const response = await request(app)
      .patch("/envelopes/transfer")
      .set("Accept", "application/json")
      .send({
        sourceEnvelopeId: "1",
        targetEnvelopeId: "2",
        amount: 1,
      });

    const { body, statusCode } = response;

    expect(statusCode).toBe(200);
    expect(body).toEqual([
      {
        budget: 9,
        id: "1",
        name: "Test",
      },
      {
        budget: 76,
        id: "2",
        name: "Test2",
      },
    ]);
  });

  it("should return 404, envelopes do not exist (PATCH /trasnfer)", async () => {
    const response = await request(app)
      .patch("/envelopes/transfer")
      .set("Accept", "application/json")
      .send({
        sourceEnvelopeId: "33",
        targetEnvelopeId: "44",
        amount: 100,
      });

    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });

  it("should return 404, envelope 44 does not exist (PATCH /trasnfer)", async () => {
    const response = await request(app)
      .patch("/envelopes/transfer")
      .set("Accept", "application/json")
      .send({
        sourceEnvelopeId: "1",
        targetEnvelopeId: "44",
        amount: 1,
      });

    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });

  it("should return 400, envelope 1 does not have sufficient funds (PATCH /trasnfer)", async () => {
    const response = await request(app)
      .patch("/envelopes/transfer")
      .set("Accept", "application/json")
      .send({
        sourceEnvelopeId: "1",
        targetEnvelopeId: "2",
        amount: 100,
      });

    const { statusCode } = response;

    expect(statusCode).toBe(400);
  });

  it("should return 400, request payload is not validated by schema (PATCH /trasnfer)", async () => {
    const response = await request(app)
      .patch("/envelopes/transfer")
      .set("Accept", "application/json")
      .send({
        source: "1",
        target: "2",
        budget: 100,
      });

    const { statusCode } = response;

    expect(statusCode).toBe(400);
  });

  it("should return envelope with id 123delete deleted successfully (DELETE /:id)", async () => {
    envelopes.push({
      name: "toDelete",
      budget: 10,
      id: "123delete",
    } as Envelope);
    const response = await request(app).delete("/envelopes/123delete");
    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it("should return envelope with id 123 is not found (DELETE /:id)", async () => {
    const response = await request(app).delete("/envelopes/123");
    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });
});
