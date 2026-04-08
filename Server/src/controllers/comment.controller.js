import { asyncHandler } from "../utils/AsyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { createActivity } from "../utils/createActivity.js";
import mongoose from "mongoose";
import { Card } from "../models/card.model.js";

const getCardComments = asyncHandler(async (req, res) => {
    const {cardId} = req.params;

    if (!cardId)
        throw new ApiError(400, "Card id is required.")
    if (!mongoose.isValidObjectId(cardId))
        throw new ApiError(400, "Invalid card id.")

    const comments = await Comment.find({card: cardId})
                                    .sort({createdAt: -1});

    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, "Card comments fetched successfully")
    ); 
});

const createComment = asyncHandler(async (req, res) => {
    const {text} = req.body;
    const {cardId} = req.params;

    if (!text)
        throw new ApiError(400, "Comment text is required.")
    if (!cardId)
        throw new ApiError(400, "Card id is required.")
    if (!mongoose.isValidObjectId(cardId))
        throw new ApiError(400, "Invalid card id.")

    const [comment, card] = await Promise.all([
        Comment.create({
            text,
            card: cardId,
            board: req.board?._id,
            createdBy: req.user?._id
        }),
        Card.findById(cardId)
    ])

    if (!comment)
        throw new ApiError(500, "Comment is not created.")
    if (!card)
        throw new ApiError(404, "Card not found.")

    await createActivity(
        req.board?._id,
        `${req.user?.fullName?.split(" ")[0]} commented on ${card.title}.`,
    )

    return res
    .status(201)
    .json(
        new ApiResponse(201, comment, "Comment created successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId)
        throw new ApiError(400, "Comment id is required.")
    if (!mongoose.isValidObjectId(commentId))
        throw new ApiError(400, "Invalid comment id.")

    const comment = await Comment.findById(commentId);
    if (!comment)       
        throw new ApiError(404, "Comment not found.")

    if (comment.createdBy.toString() !== req.user?._id.toString())
        throw new ApiError(401, "Unauthorized request.")

    await comment.deleteOne();

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});

export {getCardComments, createComment, deleteComment};