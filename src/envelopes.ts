import express, { NextFunction, Request, Response } from "express";
import envelopeSchema from "./schemas/Envelope.json";
import { validate } from "./utils/validate";

const router = express.Router();

interface Envelope {
  name: string;
  id: number;
  budget: number;
}

const envelopes: Envelope[] = [];

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(envelopes);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const isValid = validate(envelopeSchema, req.body);
    if (isValid.isValid) {
      envelopes.push(req.body);
      res.status(201).send(envelopes);
    } else {
      res.status(400).send(isValid.errors);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
