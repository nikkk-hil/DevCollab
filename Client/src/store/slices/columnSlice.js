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
        }
    }
})

export const { addColumn, removeColumn } = columnSlice.actions;
export default columnSlice.reducer;