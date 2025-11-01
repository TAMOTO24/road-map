import { Board, BoardDoc, Card } from "../models/Board";
import { Request, Response } from "express";

export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards: BoardDoc[] = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching boards" });
  }
};

export const createBoard = async (req: Request, res: Response) => {
  const { name, columns } = req.body;
  console.log("Creating board with name:", name, columns);
  try {
    const newBoard = new Board({ name, columns });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: `Error creating board: ${error}` });
  }
};

export const createNewCard = async (req: Request, res: Response) => {
  const { boardId, columnId, title, description } = req.body;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const newCard: Card = {
      _id: new Date().getTime().toString(),
      title,
      description,
    };
    const key = columnId as keyof typeof board.columns;
    board.columns[key].push(newCard);

    await board.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: "Error creating card" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { columnId, cardId } = req.body;
  try {
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const columnKey = columnId as keyof typeof board.columns;
    const cardIndex = board.columns[columnKey].findIndex(
      (card) => card._id === cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({ message: "Card not found" });
    }

    board.columns[columnKey].splice(cardIndex, 1);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: `Error deleting card: ${error}` });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { columnId, cardId, title, description } = req.body;
  try {
    const updatedCard = await Board.findById(id);

    if (!updatedCard) {
      return res.status(404).json({ message: "Board not found" });
    }
    const columnKey = columnId as keyof typeof updatedCard.columns;
    const cardIndex = updatedCard.columns[columnKey].findIndex(
      (card) => card._id === cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({ message: "Card not found" });
    }
    if (
      !updatedCard.columns[columnKey] ||
      !updatedCard.columns[columnKey][cardIndex]
    ) {
      return res.status(404).json({ message: "Card not found" });
    }
    updatedCard.columns[columnKey][cardIndex] = {
      _id: updatedCard.columns[columnKey][cardIndex]._id,
      title,
      description,
    };
    await updatedCard.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: `Error updating card: ${error}` });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Updating board with ID:", id);
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { columns: req.body.columns },
      { new: true }
    );
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: "Error updating board" });
  }
};
