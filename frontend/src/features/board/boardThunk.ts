import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Board, Columns } from "./boardSlice.ts";

const host = "https://road-map-dp5b.onrender.com";

export const fetchBoards = createAsyncThunk("board/fetchBoards", async () => {
  try {
    const response = await axios.get<Board[]>(`${host}/boards`);
    console.log("Fetch success:", response.data);
    return response.data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
});

export const saveBoardColumns = createAsyncThunk(
  "boards/saveColumns",
  async ({ boardId, columns }: { boardId: string; columns: Columns }) => {
    console.log("Saving columns for board ID:", boardId, columns);
    const res = await axios.put(
      `${host}/boards/${boardId}`,
      { columns },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  }
);
