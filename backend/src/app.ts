import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppError } from "./utils/errors";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API running...");
});

app.use("/api", routes);

app.use((_req, _res, next) => {
  next(AppError.notFound("Route not found"));
});

app.use(errorMiddleware);

export default app;
