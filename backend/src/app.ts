import express, { Request, Response } from "express";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import "./db";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use("/boards", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
