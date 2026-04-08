import { Activity } from "../models/activity.model.js";
import { getIO } from "../socket.js";

const createActivity = async(boardId, action) => {
    const activity = await Activity.create({
        board: boardId,
        action
    }) 

    getIO().to(boardId).emit("activity:new", activity)
}

export {createActivity}