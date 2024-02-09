import express from "express";
import morgan from "morgan";
import errorHandler from "errorhandler";
import envelopes from "./envelopes";

export const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/envelopes", envelopes);

app.use(errorHandler());
