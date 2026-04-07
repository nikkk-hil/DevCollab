import mongoose from "mongoose";
import { Card } from "../models/card.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Column } from "../models/column.model.js";
import { Board } from "../models/board.model.js";
import { createActivity } from "../utils/createActivity.js";

const parseTags = (tags) => {
  if (typeof tags !== "string") return [];

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getAllCards = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  if (!boardId) throw new ApiError(400, "Board id is required");
  if (!mongoose.isValidObjectId(boardId))
    throw new ApiError(400, "Invalid board id.");

  const cards = await Card.find({ board: boardId }).sort({ order: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, cards, "All board cards fetched."));
});

const createCard = asyncHandler(async (req, res) => {
  const { title, order, tags, difficulty, link, description, priority } =
    req.body;
  const columnId = req.column?._id;

  const fields = {
    title,
    order,
    tags,
    difficulty,
    link,
    description,
    priority,
  };

  if (!title || !order)
    throw new ApiError(400, "Both title and order is required.");

  fields.tags = parseTags(fields.tags);

  let update = {};
  for (const key in fields) {
    if (fields[key]) {
      update[key] = fields[key];
    }
  }

  const card = await Card.create({
    ...update,
    board: req.board?._id,
    column: columnId,
    createdBy: req.user?._id,
  });

  if (!card) 
    throw new ApiError(500, "Card is not created.");
  
  await createActivity(
    req.board?._id,
    `${req.user?.name?.split(" ")[0]} created a card.`,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, card, "Card created successfully."));
});

const editCard = asyncHandler(async (req, res) => {
  const { title, order, tags, difficulty, link, description, priority } =
    req.body;
  const fields = {
    title,
    order,
    tags,
    difficulty,
    link,
    description,
    priority,
  };

  const card = req.card;

  fields.tags = parseTags(fields.tags);

  for (const key in fields) {
    if (fields[key]) {
      card[key] = fields[key];
    }
  }
  await card.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, card, "Card updated successfully."));
});

const deleteCard = asyncHandler(async (req, res) => {
  const cardId = req.card?._id;

  const cardDelete = Card.findByIdAndDelete(cardId);
  const commentDelete = Comment.deleteMany({ card: cardId });

  await Promise.all([cardDelete, commentDelete]);

  await createActivity(
    req.board?._id,
    `${req.user?.name?.split(" ")[0]} deleted a card.`,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Card deleted successfully."));
});

const addAssignee = asyncHandler(async (req, res) => {
  const { assigneeId } = req.params;
  const card = req.card;
  const boardId = card.board;

  if (!assigneeId) throw new ApiError(400, "Assignee id is required");
  if (!mongoose.isValidObjectId(assigneeId))
    throw new ApiError(400, "Invalid assignee id.");

  const board = await Board.findById(boardId);

  if (
    assigneeId.toString() !== board.owner.toString() &&
    !board.members.some((mem) => mem.toString() === assigneeId.toString())
  ){
    throw new ApiError(
      401,
      "Unauthorized Request, user is not a member or admin of the board.",
    );
}

  if (req.user._id.toString() === assigneeId)
    throw new ApiError(400, "You can not assignee a card to yourself.");

  const assignees = card.assignees;

  if (assignees.some((assignee) => assignee.toString() === assigneeId))
    throw new ApiError(409, "User is already assigned.");

  card.assignees.push(assigneeId);
  await card.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, card, "Assignee added for the card."));
});

const removeAssignee = asyncHandler(async (req, res) => {
  const { assigneeId } = req.params;
  const card = req.card;

  if (!assigneeId) throw new ApiError(400, "Assignee id is required");
  if (!mongoose.isValidObjectId(assigneeId))
    throw new ApiError(400, "Invalid assignee id.");

  const assignees = card.assignees;

  if (!assignees.some((assignee) => assignee.toString() === assigneeId))
    throw new ApiError(409, "User is not assigned the card.");

  card.assignees = assignees.filter(
    (assignee) => assignee.toString() !== assigneeId,
  );

  await card.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, card, "Assignee removed from the card."));
});

const moveCard = asyncHandler(async (req, res) => {
    const {cardId} = req.params;
    const userId = req.user?._id;
    const column = req.column;

    if (!cardId) throw new ApiError(400, "Card id and column id are required.");
    if (!mongoose.isValidObjectId(cardId))
        throw new ApiError(400, "Invalid card id.");

    const card = await Card.findById(cardId);
    if (!card) throw new ApiError(404, "Card not found.");

    if (card.column.toString() === column._id.toString())
        throw new ApiError(400, "Card is already in the specified column.");

    if (!card.assignees.some(assignee => assignee.toString() === userId.toString()))
        throw new ApiError(403, "Unauthorized Request, user is not assigned to the card.");

    card.column = column._id;
    await card.save({ validateBeforeSave: false });

    await createActivity(
        req.board?._id,
        `${req.user?.name?.split(" ")[0]} moved ${card.title} to ${column.title}.`,
      );
});

export {
  getAllCards,
  createCard,
  editCard,
  deleteCard,
  addAssignee,
  removeAssignee,
  moveCard,
};
