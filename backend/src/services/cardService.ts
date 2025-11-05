import { Board } from "../models/Board";
import { Card } from "../types/board.types";

export const createCard = async (
  boardId: string,
  columnId: string,
  title: string,
  description: string
): Promise<Card | null> => {
  const board = await Board.findById(boardId);
  if (!board) throw new Error("Board not found");

  const newCard: Card = {
    _id: new Date().getTime().toString(),
    title,
    description,
  };

  const key = columnId as keyof typeof board.columns;
  board.columns[key].push(newCard);

  await board.save();
  return newCard;
};

export const updateCard = async (
  boardId: string,
  columnId: string,
  cardId: string,
  title: string,
  description: string
) => {
  const board = await Board.findById(boardId);
  if (!board) throw new Error("Board not found");

  const columnKey = columnId as keyof typeof board.columns;
  const cardIndex = board.columns[columnKey].findIndex((c) => c._id === cardId);

  if (cardIndex === -1 || !board.columns[columnKey][cardIndex]) throw new Error("Card not found");

  board.columns[columnKey][cardIndex] = {
    _id: board.columns[columnKey][cardIndex]._id,
    title,
    description,
  };

  await board.save();
  return board;
};

export const deleteCard = async (
  boardId: string,
  columnId: string,
  cardId: string
) => {
  const board = await Board.findById(boardId);
  if (!board) throw new Error("Board not found");

  const columnKey = columnId as keyof typeof board.columns;
  const cardIndex = board.columns[columnKey].findIndex((c) => c._id === cardId);

  if (cardIndex === -1) throw new Error("Card not found");

  board.columns[columnKey].splice(cardIndex, 1);
  await board.save();

  return board;
};
