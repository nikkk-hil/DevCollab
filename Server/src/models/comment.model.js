import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Comment is required."],
    },

    card: {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },

    board: {
       type: Schema.Types.ObjectId,
      ref: "Board",       
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
