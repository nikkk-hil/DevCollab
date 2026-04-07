import { Activity } from "../models/activity.model.js";

const createActivity = async(boardId, action) => {
    await Activity.create({
        board: boardId,
        action
    }) 
}

export {createActivity}