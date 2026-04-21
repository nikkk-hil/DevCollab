import { createSlice } from "@reduxjs/toolkit";
import { editCard } from "../../api/card";

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
        },

        updateCard: (state, action) => {
            const index = state.cards.findIndex((card) => card._id === action.payload._id);
            if (index !== -1) {
                state.cards[index] = action.payload;
            }
        },

        clearCards: (state) => {
            state.cards = [];
        }

    }
})

export const {addCard, removeCard, changeColumnOfCard, updateCard, clearCards} = cardSlice.actions;
export default cardSlice.reducer;