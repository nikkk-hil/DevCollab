import mongoose from "mongoose";
import { Card } from "../models/card.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Board } from "../models/board.model.js";
import { createActivity } from "../utils/createActivity.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import CardProgress from "../models/cardProgress.model.js";
import { getAiResponse } from "../utils/geminiService.js";

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

  const boardCards = await Card.find({ board: boardId })
    .populate("createdBy", "fullName username avatar")
    .sort({
      createdAt: -1,
    });
  const userCards = await CardProgress.find({
    user: req.user?._id,
    card: { $in: boardCards.map((card) => card._id) },
  });

  let progress = {};
  userCards.forEach((c) => (progress[c.card.toString()] = c));

  const result = boardCards.map((card) => {
    const p = progress[card._id.toString()];
    return {
      ...card.toObject(),
      status: p ? p.status : "to-do",
      order: p ? p.order : null,
      notes: p ? p.notes : null,
      aiFeedback: p ? p.aiFeedback : null
    };
  });

  let groupedCards = {
    "to-do": [],
    "in-progress": [],
    "completed": [],
  };

  result.forEach((c) => groupedCards[c.status].push(c));
  Object.keys(groupedCards).forEach((status) => {
    groupedCards[status].sort((a, b) => {
      if (a.order === null && b.order === null) return 0;
      else if (a.order === null) return 1;
      else if (b.order === null) return -1;
      else return a.order - b.order;
    });
  });

  return res
    .status(200)
    .json(new ApiResponse(200, groupedCards, "All board cards fetched."));
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

  if (!title) throw new ApiError(400, "Title is required.");

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
    createdBy: req.user?._id,
  });

  if (!card) throw new ApiError(500, "Card is not created.");

  const populatedCard = await Card.findById(card._id).populate(
    "createdBy",
    "fullName username avatar",
  );

  await createActivity(
    req.board?._id,
    `${req.user?.fullName?.split(" ")[0]} created ${card.title}.`,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedCard || card, "Card created successfully."));
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
    req.card?.board,
    `${req.user?.fullName?.split(" ")[0]} deleted ${req.card?.title}.`,
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
  ) {
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

  const [, assignee] = await Promise.all([
    card.save({ validateBeforeSave: false }),
    User.findById(assigneeId),
  ]);

  const updatedCard = await Card.findById(card._id).populate(
    "assignees",
    "fullName username avatar",
  );

  await createActivity(
    boardId,
    `${req.user?.fullName?.split(" ")[0]} assigned ${assignee?.fullName?.split(" ")[0]} to ${card.title}.`,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCard, "Assignee added for the card."));
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

  const [, assignee] = await Promise.all([
    card.save({ validateBeforeSave: false }),
    User.findById(assigneeId),
  ]);

  const updatedCard = await Card.findById(card._id).populate(
    "assignees",
    "fullName username avatar",
  );

  await createActivity(
    card.board,
    `${req.user?.fullName?.split(" ")[0]} removed ${assignee?.fullName?.split(" ")[0]} from ${card.title}.`,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCard, "Assignee removed from the card."));
});

const moveCard = asyncHandler(async (req, res) => {
  const { cardId, boardId } = req.params;
  const userId = req.user?._id;
  const column = req.column;

  if (!cardId) throw new ApiError(400, "Card id and column id are required.");
  if (!mongoose.isValidObjectId(cardId))
    throw new ApiError(400, "Invalid card id.");

  const card = await Card.findById(cardId);
  if (!card) throw new ApiError(404, "Card not found.");

  if (card.column.toString() === column._id.toString())
    throw new ApiError(400, "Card is already in the specified column.");

  if (
    !card.assignees.some(
      (assignee) => assignee.toString() === userId.toString(),
    )
  )
    throw new ApiError(
      403,
      "Unauthorized Request, user is not authorized to move the card.",
    );

  card.column = column._id;
  await card.save({ validateBeforeSave: false });

  await createActivity(
    boardId,
    `${req.user?.fullName?.split(" ")[0]} moved ${card.title} to ${column.title}.`,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, card, "Card moved successfully"));
});

const updateCardProgress = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { status, notes, aiFeedback } = req.body;
  const userId = req.user?._id;

  const fields = {status, notes, aiFeedback}

  //validation
  if (!cardId) throw new ApiError(400, "Card id is required.");
  if (!mongoose.isValidObjectId(cardId))
    throw new ApiError(400, "Invalid card id.");

  if (!["to-do", "in-progress", "completed"].includes(status))
    throw new ApiError(400, "Invalid status.");

  let update = {};

  for(const key in fields){
    if (fields[key])
      update[key] = fields[key];
  }
  console.log(notes)
  // console.log(update)

  const card = await Card.findById(cardId).select("title board");
  if (!card) throw new ApiError(404, "Card not found.");

  const maxOrder = await CardProgress.findOne({ user: userId, status })
    .sort({ order: -1 })
    .select("order")
    .lean();

  const newOrder = maxOrder ? maxOrder.order + 100 : 100;

  const cardProgress = await CardProgress.findOneAndUpdate(
    { card: cardId, user: userId },
    { ...update, order: newOrder },
    { upsert: true, new: true },
  );

  await createActivity(
    card.board,
    `${req.user?.fullName?.split(" ")[0]} moved ${card.title} to ${status}.`,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, cardProgress, "Card progress updated successfully."),
    );
}); 

const getFeedback = asyncHandler(async (req, res) => {
  const {cardId} = req.params;
  const {problemTitle, code, notes} = req.body

  if (!code && !notes)
    throw new ApiError(400, "Code or Notes is required.");

  console.log("Before calling getAiResponse")
  const feedbackResponse = await getAiResponse({title: problemTitle, notes, code});

  if (!feedbackResponse)
    throw new ApiError(500, "Feedback evaluation failed, try again.")

  const cardProgress = await CardProgress.findOneAndUpdate({card: cardId, user: req.user._id},
    {aiFeedback: feedbackResponse}, {mew: true}
  )

  return res
    .status(200)
    .json(
      new ApiResponse(200, cardProgress, "Feedback evaluated successfully.")
    )
  /*
  */
  // call gemini

  //store ai feedback in the cardProgress

  // send response
});

export {
  getAllCards,
  createCard,
  editCard,
  deleteCard,
  addAssignee,
  removeAssignee,
  moveCard,
  updateCardProgress,
  getFeedback
};
