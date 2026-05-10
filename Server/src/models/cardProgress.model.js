import mongoose, { Schema } from "mongoose";

const cardProgressSchema = new Schema(
  {
    card: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "completed"],
      default: "to-do",
    },
    order: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer",
      },
    },
    notes: {
      approach: String,
      struggles: String,
      timeComplexity: String,
      spaceComplexity: String,
      takeaway: String
    },
    aiFeedback: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

const CardProgress = mongoose.model("CardProgress", cardProgressSchema);

export default CardProgress;
