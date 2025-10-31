import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Board } from './boardSlice.ts';

export const fetchBoards = createAsyncThunk(
  'board/fetchBoards',
  async () => {
    const response = await axios.get<Board[]>('http://localhost:5000/boards');
    return response.data;
  }
);
