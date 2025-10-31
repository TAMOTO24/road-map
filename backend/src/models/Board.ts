import mongoose, { Document, Schema, Model } from "mongoose";

export interface Card {
  _id: string;
  title: string;
  description: string;
}

export interface Columns {
  todo: Card[];
  inProgress: Card[];
  done: Card[];
}

export interface BoardDoc extends Document {
  name: string;
  columns: Columns;
}

const boardSchema = new Schema<BoardDoc>({
  name: { type: String, required: true },
  columns: {
    todo: Array,
    inProgress: Array,
    done: Array,
  },
});

export const Board: Model<BoardDoc> =
  mongoose.models.boards || mongoose.model<BoardDoc>("boards", boardSchema);
