import express, { NextFunction, Request, Response } from "express";
import envelopeSchema from "./schemas/Envelope.json";
import { validate } from "./utils/validate";
import * as uuid from "uuid";

const router = express.Router();

export interface Envelope {
  name: string;
  id: string;
  budget: number;
}

export const envelopes: Envelope[] = [];

router.get("/", (_req: Request, res: Response, next: NextFunction) => {
  res.send(envelopes);
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const isValid = validate(envelopeSchema, req.body);
    if (isValid.isValid) {
      const id = uuid.v4();
      const envelope = { ...req.body };
      envelope.id = id;

      envelopes.push(envelope);
      res.status(201).send(envelope);
    } else {
      res.status(400).send(isValid.errors);
      throw new Error(
        `Schema not validated:\n ${JSON.stringify(isValid.errors)}`,
      );
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const matchingEnvelope = envelopes.filter((envelope) => {
      if (envelope.id === req.params.id) {
        return envelope;
      }
    });

    if (matchingEnvelope.length === 0) {
      res.status(404).send(`Envelope with id ${req.params.id} not found`);
      throw new Error(`Envelope with id ${req.params.id} not found`);
    }

    res.send(matchingEnvelope);
  } catch (error) {
    next(error);
  }
});

export default router;
