import { Request, Response, NextFunction } from "express";
import * as boardService from "../services/boardService.js";

export const getBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const boards = await boardService.getBoards();

  if (!boards) return next(new Error("Boards not found"));

  res.json(boards);
};

export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, columns } = req.body;
  const newBoard = await boardService.createBoard(name, columns);

  if (!newBoard) return next(new Error("Board creation failed"));

  res.status(201).json(newBoard);
};

export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId } = req.params;

  if (!boardId) return next(new Error("Board ID is required"));

  const updatedBoard = await boardService.updateBoard(
    boardId,
    req.body.columns
  );

  if (!updatedBoard) return next(new Error("Board not found"));

  res.json(updatedBoard);
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId } = req.params;
  if (!boardId) return next(new Error("Board ID is required"));

  const deleted = await boardService.deleteBoard(boardId);
  if (!deleted) return next(new Error("Board not found"));

  res.json({ message: "Board deleted successfully" });
};
