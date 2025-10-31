import { Board, BoardDoc } from "../models/Board";
import { Request, Response } from "express";

export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards: BoardDoc[] = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching boards" });
  }
};

// const createBoard = async (req: Request, res: Response) => {
//   try {
//     const newBoard = new Board(req.body);
//     await newBoard.save();
//     res.status(201).json(newBoard);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating board" });
//   }
// };

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

// const deleteBoard = async (req: Request, res: Response) => {
//   try {
//     await Board.findByIdAndDelete(req.params.id);
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting board" });
//   }
// };
