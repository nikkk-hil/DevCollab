import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    columns: []
}

const columnSlice = createSlice({
    name: "column",
    initialState,
    reducers: {
        addColumn: (state, action) => {
            state.columns.push(action.payload);
        },

        removeColumn: (state, action) => {
            state.columns = state.columns.filter((column) => column._id?.toString() !== action.payload.columnId)
        },

        updateColumn: (state, action) => {
            const index = state.columns.findIndex((column) => column._id === action.payload._id);
            if (index !== -1) {
                state.columns[index] = action.payload;
            }
        },

        clearColumns: (state) => {
            state.columns = [];
        }
    }
})

export const { addColumn, removeColumn, updateColumn, clearColumns } = columnSlice.actions;
export default columnSlice.reducer;