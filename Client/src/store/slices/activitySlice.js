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
        }
    }
})

export const {addActivity, clearActivities} = activitySlice.actions;
export default activitySlice.reducer