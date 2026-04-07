import mongoose from "mongoose";
import { Card } from "../models/card.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getAllCards = asyncHandler(async (req, res) => {
    const {boardId} = req.params;

    if (!boardId)
        throw new ApiError(400, "Board id is required")
    if (!mongoose.isValidObjectId(boardId))
        throw new ApiError(400, "Invalid board id.")

    const cards = await Card.find({board: boardId})
                            .sort({order: 1});

    return res
    .status(200)
    .json(
        new ApiResponse(200, cards, "All board cards fetched.")
    )
});

const createCard = asyncHandler(async (req, res) => {
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

  if (!title || !order)
    throw new ApiError(400, "Both title and order is required.");

  let tagArr = [];

  if (fields.tags){
    let str = "";
    for(let i = 0; i < fields.tags.length; i++){
        const char = fields.tags[i]
        if (i === fields.tags.length-1){
            str += char;
            tagArr.push(str);
        }
        else if (char === ','){
            tagArr.push(str)
            str = ""
            while(i+1 < fields.tags.length && fields.tags[i+1] === ' ')
                i++;
        } else {
            str += char;
        }
    }
  }

  fields.tags = tagArr;

  let update = {};
  for (const key in fields) {
    if (fields[key]) {
      update[key] = fields[key];
    }
  }

  const card = await Card.create({
    ...update,
    board: req.board?._id,
    column: req.column?._id,
    createdBy: req.user?._id,
  });

  if (!card) throw new ApiError(500, "Card is not created.");

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

  let tagArr = [];

  if (fields.tags){
    let str = "";
    for(let i = 0; i < fields.tags.length; i++){
        const char = fields.tags[i]
        if (i === fields.tags.length-1){
            str += char;
            tagArr.push(str);
        }
        else if (char === ','){
            tagArr.push(str)
            str = ""
            while(i+1 < fields.tags.length && fields.tags[i+1] === ' ')
                i++;
        } else {
            str += char;
        }
    }
  }

  fields.tags = tagArr;

  for (const key in fields) {
    if (fields[key]) {
      card[key] = fields[key];
    }
  }
  await card.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(
    new ApiResponse(200, card, "Card updated successfully.")
    )
});

const deleteCard = asyncHandler(async (req, res) => {
 
    const cardId = req.card?._id;

    const cardDelete = Card.findByIdAndDelete(cardId);
    const commentDelete = Comment.deleteMany({card: cardId});

    await Promise.all([cardDelete, commentDelete]);

  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, "Card deleted successfully.")
    )
});

const addAssignee = asyncHandler(async (req, res) => {
    const {assigneeId} = req.params;
    const card = req.card;

    if (!assigneeId)
        throw new ApiError(400, "Assignee id is required")
    if (!mongoose.isValidObjectId(assigneeId))
        throw new ApiError(400, "Invalid assignee id.")

    if (req.user._id.toString() === assigneeId)
        throw new ApiError(400, "You can not assignee a card to yourself.")

    const assignees = card.assignees;

    if (assignees.some( assignee => assignee.toString() === assigneeId ))
        throw new ApiError(409, "User is already assigned.")

    card.assignees.push(assigneeId);
    await card.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, card, "Assignee added for the card.")
    )
});

const removeAssignee = asyncHandler(async (req, res) => {
    const {assigneeId} = req.params;
    const card = req.card;

    if (!assigneeId)
        throw new ApiError(400, "Assignee id is required")
    if (!mongoose.isValidObjectId(assigneeId))
        throw new ApiError(400, "Invalid assignee id.")

    const assignees = card.assignees;

    if (!(assignees.some( assignee => assignee.toString() === assigneeId )))
        throw new ApiError(409, "User is not assigned the card.")

    card.assignees = assignees.filter((assignee) => assignee.toString() !== assigneeId);

    await card.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, card, "Assignee removed from the card.")
    )
});

export { getAllCards, createCard, editCard, deleteCard, addAssignee, removeAssignee };
