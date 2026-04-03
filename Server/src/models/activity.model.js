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
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, {timestamps: true}
);

export const Activity = mongoose.model("Activity", activitySchema);
