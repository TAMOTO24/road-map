import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBoards } from "./boardThunk.ts";

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Columns {
  todo: Card[];
  inProgress: Card[];
  done: Card[];
}

export interface Board {
  id: string;
  name: string;
  columns: Columns;
}

interface BoardState {
  boards: Board[];
  activeBoardId: string | null;
}

const initialState: BoardState = {
  boards: [],
  activeBoardId: null,
};

// Example of a Redux slice for a board feature
export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getCurrent: (state, action: PayloadAction<string>) => {
      state.activeBoardId = action.payload;
    },

    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },

    updateBoardColumns: (
      state,
      action: PayloadAction<{ boardId: string; columns: Columns }>
    ) => {
      const { boardId, columns } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.columns = columns;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchBoards.fulfilled,
      (state, action: PayloadAction<Board[]>) => {
        state.boards = action.payload;
      }
    );
  },
});

export const { getCurrent, setBoards, updateBoardColumns } = boardSlice.actions;

export default boardSlice.reducer;
