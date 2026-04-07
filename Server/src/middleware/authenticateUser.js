import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Board } from "../models/board.model.js";
import { Column } from "../models/column.model.js";

const authenticateUser = asyncHandler(async (req, _, next) => {
  const { boardId, columnId } = req.params;
  const userId = req.user?._id;

  if (!boardId || !columnId)
    throw new ApiError(400, "Both boardId and columnId required.");

  if (!mongoose.isValidObjectId(boardId) || !mongoose.isValidObjectId(columnId))
    throw new ApiError(400, "Invalid board or column id");

  const [board, column] = await Promise.all([
    Board.findById(boardId),
    Column.findById(columnId),
  ]);

  if (column.board.toString() !== boardId)
    throw new ApiError(403, "Given column doesn't belongs to given board.");

  if (
    userId.toString() !== board.owner.toString() &&
    !board.members.some((mem) => mem.toString() === userId.toString())
  )
    throw new ApiError(401, "Unauthorized Request.");

  req.board = board;
  req.column = column;
  next();
});

export { authenticateUser };
