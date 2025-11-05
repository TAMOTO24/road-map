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