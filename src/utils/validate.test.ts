import { validate } from "./validate";
import envelopeSchema from "../schemas/Envelope.json";

describe("validate.ts", () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  it("should return object where isValid = true", () => {
    const valid = validate(envelopeSchema, { name: "Books", budget: 70 });
    expect(valid).toEqual({ errors: undefined, isValid: true });
  });

  it("should return true", () => {
    const valid = validate(envelopeSchema, { name: "Books", amount: 70 });
    expect(valid).toHaveProperty("isValid", false);
  });
});
