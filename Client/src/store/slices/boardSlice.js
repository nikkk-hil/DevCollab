import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard: (state, action) => {
      state.boards = Array.isArray(action.payload) ? action.payload : [];
    },
    addBoard: (state, action) => {
      const data = action.payload;
      if (
        !state.boards.some((board) => {
          return board?._id === data?._id;
        })
      )
        state.boards.push(data);
    },
    removeBoard: (state, action) => {
      state.boards = state.boards.filter(
        (board) => board._id !== action.payload,
      );
    },

    updateBoard: (state, action) => {
      const index = state.boards.findIndex(
        (board) => board._id.toString() === action.payload._id,
      );
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    },

    clearBoard: (state) => {
      state.boards = [];
    },
  },
});

export const { setBoard, addBoard, removeBoard, updateBoard, clearBoard } =
  boardSlice.actions;
export default boardSlice.reducer;
