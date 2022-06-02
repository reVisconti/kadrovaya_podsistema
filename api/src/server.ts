import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";

import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import apiRouter from "./routes/api";
import logger from "jet-logger";

let cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// Constants
const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.set("trust proxy", "loopback");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use("/api", apiRouter);

/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set views dir
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static dir
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
  return;
});

// Export here and start in a diff file (for testing).
export default app;
