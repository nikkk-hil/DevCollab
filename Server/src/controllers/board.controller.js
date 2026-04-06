import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Board } from "../models/board.model.js";
import { Activity } from "../models/activity.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Card } from "../models/card.model.js";
import { Column } from "../models/column.model.js";
import { Comment } from "../models/comment.model.js";

const getAllBoards = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const boards = await Board.find({
    $or: [{ owner: userId }, { members: userId }],
  });

  return res.status(200).json(new ApiResponse(200, boards, "Boards fetched."));
});

const createBoard = asyncHandler(async (req, res) => {
  const { title, type } = req.body;
  const userId = req.user?._id;

  if (!title || !type) throw new ApiError(400, "All fields are required.");

  if (!["DSA", "Project"].some((e) => e === type.trim()))
    throw new ApiError(400, "Type of board is invalid.");

  const board = await Board.create({
    title,
    type,
    owner: userId,
  });

  if (!board) throw new ApiError(500, "Board not created.");

  return res
    .status(201)
    .json(new ApiResponse(201, board, "Board created successfully."));
});

const addMemberToBoard = asyncHandler(async (req, res) => {
  const {memberId } = req.params;

  if (!memberId) throw new ApiError(400, "Member Id is required");

  if (!mongoose.isValidObjectId(memberId))
    throw new ApiError(400, "Invalid member id.");

  if (memberId === (req.user._id.toString()))
    throw new ApiError(409, "You cannot add yourself.")

  const board = req.board;

  if (board.members.some((member) => member.toString() === memberId))
    throw new ApiError(409, "Member is already in board.");

  board.members.push(memberId);

  await board.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member added to board."));
});

const removeMemberFromBoard = asyncHandler(async (req, res) => {
  const { memberId } = req.params;

  if (!memberId) throw new ApiError(400, "Member Id is required");

  if (!mongoose.isValidObjectId(memberId))
    throw new ApiError(400, "Invalid member id.");

  const board = req.board;

  const members = board.members.filter((mem) => mem.toString() !== memberId);

  if (members.length === board.members.length)
    throw new ApiError(404, "Member not found in board.")

  board.members = members;

  await board.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member removed from board."));
});

const deleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  await Promise.all([
    Board.deleteOne({ _id: boardId }),
    Activity.deleteMany({ board: boardId }),
    Card.deleteMany({ board: boardId }),
    Column.deleteMany({ board: boardId }),
    Comment.deleteMany({ board: boardId })
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Board deleted successfully."));
});

export {
  getAllBoards,
  createBoard,
  addMemberToBoard,
  removeMemberFromBoard,
  deleteBoard,
};
