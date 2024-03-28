import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import prisma from "./db/prisma";
import searchRoutes from "./routes/search";
import cors from "cors";

const app: Application = express();
dotenv.config();
app.use(express.json());
app.use(cors())

prisma.$connect().then(() => {
  console.log("DB connection established");
});

app.use("/search", searchRoutes);

app.use("/", (_req: Request, res: Response) => {
  res
    .status(404)
    .json({ staus: "failed", message: "This URL is not found on this server" });
});

export default app;
