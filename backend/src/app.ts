import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";


const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API running...");
});


app.use("/api", routes);

export default app;