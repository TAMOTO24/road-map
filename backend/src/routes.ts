import express from "express";
import {
  getBoards,
  updateBoard,
  createNewCard,
  updateCard,
  deleteCard,
  createBoard
} from "./controller/boardController";

const routes = express.Router();

routes.use((req, res, next) => {
  console.log("ROUTE HIT:", req.method, req.originalUrl);
  next();
});

routes.get("/", getBoards);
routes.put("/:id", updateBoard);
routes.put("/card/:id", updateCard);
routes.post("/newCard", createNewCard);
routes.delete("/card/:id", deleteCard);
routes.post("/", createBoard);

export default routes;
