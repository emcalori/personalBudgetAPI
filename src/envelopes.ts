import express, { NextFunction, Request, Response } from "express";
import envelopeSchema from "./schemas/Envelope.json";
import transferSchema from "./schemas/Transfer.json";
import { validate } from "./utils/validate";
import * as uuid from "uuid";

const router = express.Router();

export interface Envelope {
  name: string;
  id: string;
  budget: number;
}

export let envelopes: Envelope[] = [];

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

router.patch("/transfer", (req: Request, res: Response, next: NextFunction) => {
  try {
    const isValid = validate(transferSchema, req.body);
    if (isValid.isValid) {
      const envelopeCheck = envelopes.filter((envelope) => {
        if (
          envelope.id === req.body.sourceEnvelopeId ||
          envelope.id === req.body.targetEnvelopeId
        ) {
          return envelope;
        }
      });

      if (envelopeCheck.length === 0) {
        res
          .status(404)
          .send(
            `Envelopes ${req.body.sourceEnvelopeId} & ${req.body.targetEnvelopeId} do not exist`,
          );
        throw new Error(
          `Envelopes ${req.body.sourceEnvelopeId} & ${req.body.targetEnvelopeId} do not exist, please try again`,
        );
      }

      if (envelopeCheck.length === 1) {
        res
          .status(404)
          .send(
            `Only envelope ${envelopeCheck[0].id} exists, please specify another valid envelope`,
          );
      }

      envelopes = envelopes.map((envelope) => {
        if (envelope.id === req.body.sourceEnvelopeId) {
          if (envelope.budget - Number(req.body.amount) < 0) {
            res
              .status(400)
              .send(
                `Insufficient funds in envelope: ${envelope.name}, id: ${envelope.id}`,
              );
            throw new Error(
              `Insufficient funds in envelope: ${envelope.name}, id: ${envelope.id}`,
            );
          }
          return {
            ...envelope,
            budget: envelope.budget - Number(req.body.amount),
          };
        } else if (envelope.id === req.body.targetEnvelopeId) {
          return {
            ...envelope,
            budget: envelope.budget + Number(req.body.amount),
          };
        }
        return envelope;
      });

      const result = envelopes.filter((envelope) => {
        if (
          envelope.id === req.body.sourceEnvelopeId ||
          envelope.id === req.body.targetEnvelopeId
        ) {
          return envelope;
        }
      });

      res.status(200).send(result);
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

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
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

    envelopes = envelopes.filter((envelope) => {
      if (envelope.id !== req.params.id) {
        return envelope;
      }
    });

    res.send(`Envelope with id ${req.params.id} deleted successfully`);
  } catch (error) {
    next(error);
  }
});

export default router;
