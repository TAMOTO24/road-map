import express from "express";
import {
  getBoards,
  updateBoard,
  createBoard,
  deleteBoard,
} from "../controller/boardController";

const BoardRoute = express.Router();

BoardRoute.get("/", getBoards);
BoardRoute.post("/", createBoard);
BoardRoute.put("/:boardId", updateBoard);
BoardRoute.delete("/:boardId", deleteBoard);

export default BoardRoute;