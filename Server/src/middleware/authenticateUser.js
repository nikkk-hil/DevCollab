import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Board } from "../models/board.model.js";

const authenticateUser = asyncHandler(async (req, _, next) => {
  const { boardId } = req.params;
  const userId = req.user?._id;

  if (!boardId)
    throw new ApiError(400, "Board id is required.");

  if (!mongoose.isValidObjectId(boardId))
    throw new ApiError(400, "Invalid board id");

  const board = await Board.findById(boardId);

  if (
    userId.toString() !== board.owner.toString() &&
    !board.members.some((mem) => mem.toString() === userId.toString())
  )
    throw new ApiError(401, "Unauthorized Request.");

  req.board = board;
  next();
});

export { authenticateUser };
