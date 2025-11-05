import mongoose, { Document, Schema, Model } from "mongoose";
import { Card, BoardDoc } from "../types/board.types";

const cardSchema = new Schema<Card>(
  {
    _id: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const boardSchema = new Schema<BoardDoc>({
  name: { type: String, required: true },
  columns: {
    todo: [cardSchema],
    inProgress: [cardSchema],
    done: [cardSchema],
  },
});

export const Board: Model<BoardDoc> =
  mongoose.models.boards || mongoose.model<BoardDoc>("boards", boardSchema);
