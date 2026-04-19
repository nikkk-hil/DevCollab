import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    boards: []
}

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        addBoard: (state, action) => {
            const data = action.payload;
            if (!state.boards.some( (board) => {
               return board?._id === data?._id
            }))
                state.boards.push(data);
        },

        removeBoard: (state, action) => {
            state.boards = state.boards.filter((board) => board._id !== action.payload)
        },

        clearBoard: (state) => {
            state.boards = [];
        }
    }
})

export const {addBoard, removeBoard, clearBoard} = boardSlice.actions;
export default boardSlice.reducer