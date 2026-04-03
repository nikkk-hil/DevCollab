import mongoose, { Schema } from "mongoose";

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Column name is required."],
      trim: true,
    },
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
  },
  { timestamps: true },
);

export const Column = mongoose.model("Column", columnSchema);
