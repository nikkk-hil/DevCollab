import mongoose from "mongoose";
import { Column } from "../models/column.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const verifyColumnExists = asyncHandler(async (req, _, next) => {
    const {columnId, boardId} = req.params;

    if (!boardId)
        throw new ApiError(400, "Board id is required")
    if (!mongoose.isValidObjectId(boardId))
        throw new ApiError(400, "Invalid board id.")

    if (!columnId)
        throw new ApiError(400, "Column id is required")
    if (!mongoose.isValidObjectId(columnId))
        throw new ApiError(400, "Invalid column id.")

    const column = await Column.findById(columnId);

    if (!column)
        throw new ApiError(404, "Column not found!")

    if (boardId.toString() !== column.board.toString())
        throw new ApiError(403, "Column doesn't belongs to this board.")

    req.column = column;
    next()
})

export {verifyColumnExists}