    import { asyncHandler } from "../utils/AsyncHandler.js";
    import { Board } from "../models/board.model.js";
    import { ApiError } from "../utils/apiError";
    import mongoose from "mongoose";

    const verifyBoardOwner = asyncHandler(async (req, _, next) => {
    const userId = req.user?._id;
    const { boardId } = req.params;

    if (!boardId) throw new ApiError(400, "Board Id is required");
    if (!mongoose.isValidObjectId(boardId))
        throw new ApiError(400, "Invalid board id.");

    const board = await Board.findById(boardId);

    if (!board) throw new ApiError(404, "Board not found.");

    if (board.owner.toString() !== userId.toString())
        throw new ApiError(401, "Unauthorized Request.");

    req.board = board;
    next();
    });

    export { verifyBoardOwner };
