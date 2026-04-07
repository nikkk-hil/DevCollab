import { asyncHandler } from "../utils/AsyncHandler.js";
import { Activity } from "../models/activity.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getBoardActivities = asyncHandler(async (req, res) => {
    const boardId = req.board?._id;

    const activities = await Activity.find({board: boardId})
                                    .sort({createdAt: -1})
                                    .limit(10);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, activities, "Board activities fetched successfully")
    );
});

export {getBoardActivities };
