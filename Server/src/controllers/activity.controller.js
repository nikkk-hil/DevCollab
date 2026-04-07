import { asyncHandler } from "../utils/AsyncHandler.js";
import { Activity } from "../models/activity.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const createActivity = asyncHandler(async (req, res) => {
    const { col } = req.body;
    const {boardId} = req.params;
    const userFullName = req.user?.fullName;

     if (!boardId)
        throw new ApiError(400, "Board id is required.")
    if (!mongoose.isValidObjectId(boardId))
        throw new ApiError(400, "Invalid board id.")

    if (!col)
        throw new ApiError(400, "Column is required.")

    let user_name = "";

    for (let i = 0; i<userFullName.length; i++){
        if (userFullName[i] === " ")
            break;
        user_name += userFullName[i];
    }

    const action = `${user_name} moved a card to ${col}`;
    const activity = await Activity.create({
        board: boardId,
        action
    });

    if (!activity)
        throw new ApiError(500, "Activity is not created.")

    return res
    .status(201)
    .json(
        new ApiResponse(201, activity, "Activity created successfully")
    );

});

const getBoardActivities = asyncHandler(async (req, res) => {
    const {boardId} = req.board?._id;

    const activities = await Activity.find({board: boardId})
                                    .sort({createdAt: -1})
                                    .limit(10);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, activities, "Board activities fetched successfully")
    );
});

export { createActivity, getBoardActivities };
