import { Request, Response, NextFunction } from "express";
import * as cardService from "../services/cardService";

export const createNewCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId } = req.params;
  const { columnId, title, description } = req.body;

  if (!boardId) return next(new Error("Board ID is required"));

  const newCard = await cardService.createCard(
    boardId,
    columnId,
    title,
    description
  );
  if (!newCard) return next(new Error("Card creation failed"));
  res.status(201).json(newCard);
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId, cardId } = req.params;
  const { columnId, title, description } = req.body;

  if (!boardId) return next(new Error("Board ID is required"));
  if (!cardId) return next(new Error("Card ID is required"));

  const updated = await cardService.updateCard(
    boardId,
    columnId,
    cardId,
    title,
    description
  );
  if (!updated) return next(new Error("Card not found"));
  res.json(updated);
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId, cardId } = req.params;
  const { columnId } = req.body;

  if (!boardId) return next(new Error("Board ID is required"));
  if (!cardId) return next(new Error("Card ID is required"));

  const deleted = await cardService.deleteCard(boardId, columnId, cardId);
  if (!deleted) return next(new Error("Card not found"));
  res.json(deleted);
};
