import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Board } from "../models/board.model.js";
import { ApiResponse } from "../utils/apiResponse";

const createBoard = asyncHandler(async (req, res) => {
  const { title, type } = req.body;
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized Request.");

  if (!title || !type) throw new ApiError(400, "All field is required.");

  if (!["DSA", "Project", "System Design"].some((e) => e === type.trim()))
    throw new ApiError(400, "Type of board is invalid.");

  const board = await Board.create({
    title,
    type,
    owner: userId,
  });

  if (!board)
    throw new ApiError(500, "Something went wrong while creating board.")

  return res
  .status(201)
  .json(
    new ApiResponse(201, board, "Board created successfully.")
  )

});




export {createBoard}
