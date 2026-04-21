import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activities: []
}

const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {
        addActivity: (state, action) => {
            state.activities.push(action.payload);
        },
        clearActivities: (state) => {
            state.activities = [];
        },
        updateActivity: (state, action) => {
            const index = state.activities.findIndex((activity) => activity._id === action.payload._id);
            if (index !== -1) {
                state.activities[index] = action.payload;
            }
        }
    }
})

export const {addActivity, clearActivities, updateActivity} = activitySlice.actions;
export default activitySlice.reducer