import express from "express";
import { getBoards, updateBoard } from "./controller/boardController";

const routes = express.Router();

routes.use((req, res, next) => {
  console.log("ROUTE HIT:", req.method, req.originalUrl);
  next();
});

routes.get("/", getBoards);
routes.put("/:id", updateBoard);

export default routes;
