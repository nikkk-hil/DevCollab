import mongoose, { Schema } from "mongoose";

const boardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Board name is required."],
            trim: true
        },
        type: {
            type: String,
            enum: ["DSA", "Project"],
            default: "DSA"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    }, {timestamps: true}
);

export const Board = mongoose.model("Board", boardSchema);