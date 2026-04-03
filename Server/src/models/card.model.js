import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Card title is required."],
      trim: true,
    },

    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    order: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer",
      },
    },

    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    column: {
      type: Schema.Types.ObjectId,
      ref: "Column",
    },

    tags: [
      {
        type: String,
        required: false,
      },
    ],

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
      required: false,
    },

    link: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: false,
    },
  },
  { timestamps: true },
);

export const Card = mongoose.model("Card", cardSchema);
