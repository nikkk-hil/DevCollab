import { createSlice } from "@reduxjs/toolkit";
import { editCard } from "../../api/card";

const initialState = {
  todoCards: [],
  inProgressCards: [],
  completedCards: [],
};

const arrayMap = {
  "to-do": "todoCards",
  "in-progress": "inProgressCards",
  "completed": "completedCards",
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    addCard: (state, action) => {
      const incomingId =
        action.payload?._id?.toString?.() || action.payload?._id;

      if (incomingId) {
        state.todoCards = state.todoCards.filter(
          (card) => (card?._id?.toString?.() || card?._id) !== incomingId,
        );
      }

      state.todoCards.unshift(action.payload);
    },

    setCards: (state, action) => {
      state.todoCards = action.payload["to-do"];
      state.inProgressCards = action.payload["in-progress"];
      state.completedCards = action.payload["completed"];
    },

    removeCard: (state, action) => {
      const cardId = action.payload.cardId;
      const fromStatus = action.payload.from;
      state[arrayMap[fromStatus]] = state[arrayMap[fromStatus]].filter(
        (card) => card._id?.toString?.() !== cardId?.toString?.(),
      );
    },
    changeStatusOfCard: (state, action) => {
      let card;
      const cardId = action.payload.cardId;
      const toStatus = action.payload.to.trim();
      const fromStatus = action.payload.from.trim();

      state[arrayMap[fromStatus]] = state[arrayMap[fromStatus]].filter((c) => {
        if (c._id.toString() === cardId.toString()) {
          card = c;
          return false;
        }
        return true;
      });
      card && state[arrayMap[toStatus]].unshift(card);
    },

    clearCards: (state) => {
      state.todoCards = [];
      state.inProgressCards = [];
      state.completedCards = [];
    },

    addFeedbackNotes: (state, action) => {
      const cardId = action.payload?.card
      const notes = action.payload?.notes
      const aiFeedback = action.payload?.aiFeedback

      state.completedCards = state.completedCards.map((card) => {
        if (card._id.toString() === cardId.toString()){
          return {
            ...card,
            notes: notes,
            aiFeedback: aiFeedback
          }
        }
        return card
      });
    }
  },
});

export const { addCard, removeCard, changeStatusOfCard, clearCards, setCards, addFeedbackNotes } =
  cardSlice.actions;
export default cardSlice.reducer;
