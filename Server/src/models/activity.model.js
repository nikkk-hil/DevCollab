import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },

  action: {
    type: String,
    required: [true, "Action is required."],
    trim: true,
  }
}, {timestamps: true}
);

activitySchema.index({ board: 1, createdAt: -1 });

export const Activity = mongoose.model("Activity", activitySchema);
