import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activities: []
}

const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {
        addActivity: (state, action) => {
            const incomingId = action.payload?._id?.toString?.() || action.payload?._id;

            if (incomingId) {
                state.activities = state.activities.filter(
                    (activity) => (activity?._id?.toString?.() || activity?._id) !== incomingId,
                );
            }

            state.activities.unshift(action.payload);
            state.activities = state.activities.slice(0, 10);
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