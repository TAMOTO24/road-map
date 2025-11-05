import { Board } from "../models/Board.js";
import { BoardDoc } from "../types/board.types.js";

export const getBoards = async (): Promise<BoardDoc[]> => {
  return await Board.find();
};

export const createBoard = async (name: string, columns: any) => {
  const newBoard = new Board({ name, columns });
  await newBoard.save();
  return newBoard;
};

export const updateBoard = async (boardId: string, columns: any) => {
  const updated = await Board.findByIdAndUpdate(boardId, { columns }, { new: true });
  return updated;
};

export const deleteBoard = async (boardId: string) => {
  const deleted = await Board.findByIdAndDelete(boardId);
  return deleted;
};