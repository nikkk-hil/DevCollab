import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

const createColumn = asyncHandler(async (req, res) => {
    const {title, order} = req.body;
    const {boardId} = req.params;

    if (!title || !order)
        throw new ApiError(400, "Title or order is required.")

    if (!boardId)
        throw new ApiError(400, "Board id is required");

    if (!mongoose.isValidObjectId(boardId))
        throw new ApiError(400, "Invalid board id.")


})