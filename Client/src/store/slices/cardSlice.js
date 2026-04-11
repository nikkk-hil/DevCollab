import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cards: []
}

const cardSlice = createSlice({
    name: "card",
    initialState,
    reducers: {
        addCard: (state, action) => {
            state.cards.push(action.payload);
        },

        removeCard: (state, action) => {
            state.cards = state.cards.filter((card) => card._id?.toString() !== action.payload.cardId)
        },

        changeColumnOfCard: (state, action) => {
            state.cards.forEach((card) => {
                if (card._id?.toString() === action.payload.cardId)
                    card.column = action.payload.columnId
            })
        }
    }
})

export const {addCard, removeCard, changeColumnOfCard} = cardSlice.actions;
export default cardSlice.reducer;