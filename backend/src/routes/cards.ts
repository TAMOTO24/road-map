import express from "express";
import {
  createNewCard,
  updateCard,
  deleteCard,
} from "../controller/cardController";

const CardRoute = express.Router();

CardRoute.post("/:boardId/cards", createNewCard);
CardRoute.put("/:boardId/cards/:cardId", updateCard);
CardRoute.delete("/:boardId/cards/:cardId", deleteCard);

export default CardRoute;
