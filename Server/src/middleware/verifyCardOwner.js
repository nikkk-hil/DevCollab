import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Card } from "../models/card.model.js";


const verifyCardOwner = asyncHandler(async(req, _, next) => {
    const {cardId} = req.params;

    if (!cardId)
        throw new ApiError(400, "Card id is required")

    if (!mongoose.isValidObjectId(cardId))
        throw new ApiError(400, "Invalid card id.")

    const card = await Card.findById(cardId);

    if (!card)
        throw new ApiError(400, "Card not found.")

    if (card.createdBy.toString() !== req.user?._id.toString())
        throw new ApiError(401, "Unauthorized access.")

    req.card = card;
    next();
})

export {verifyCardOwner};