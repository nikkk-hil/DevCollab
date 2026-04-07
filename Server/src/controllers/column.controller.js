import { Card } from "../models/card.model.js";
import { Column } from "../models/column.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose from "mongoose";

const getBoardColumn = asyncHandler(async (req, res) => {
    const {boardId} = req.params;

    if (!boardId)
        throw new ApiError(400, "Board id is required")
    if (!mongoose.isValidObjectId(boardId))
        throw new ApiError(400, "Invalid board id.")

    const columns = await Column.find({board: boardId})
                                .sort({order: 1});

    return res
    .status(200)
    .json(
        new ApiResponse(200, columns, "Columns fetched successfully")
    )
});

const createColumn = asyncHandler(async (req, res) => {
    const {title, order} = req.body;
    const boardId = req.board?._id

    if (!title || !order)
        throw new ApiError(400, "Title or order is required.")

    const intOrder = parseInt(order);
    const column = await Column.create({
        title,
        order: intOrder,
        board: boardId
    })

    if(!column)
        throw new ApiError(500, "Column is not created")

    return res
    .status(201)
    .json(
        new ApiResponse(201, column, "Column created successfully")
    )
});

const editColumn = asyncHandler(async (req, res) => {
    const {title, order} = req.body;
    const column = req.column;

    if(!title && !order){
        throw new ApiError(400, "Title or Order is required.")
    }
    
    if (title) column.title = title;
    if (order) column.order = parseInt(order);
    
    await column.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, column, "Column updated successfully")
    )
});

const deleteColumn = asyncHandler(async (req, res) => {
    const column = req.column;
    const columnId = column._id;

    const cardsId = await Card.find({column: columnId}).select("_id");

    const deletedCardsId = cardsId.map((obj) => obj._id);

    await Promise.all([
        Column.findByIdAndDelete(columnId),
        Card.deleteMany({column: columnId}),
        Comment.deleteMany({card: {$in: deletedCardsId}})
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Column deleted successfully")
    )
});

export {createColumn, editColumn, deleteColumn, getBoardColumn};