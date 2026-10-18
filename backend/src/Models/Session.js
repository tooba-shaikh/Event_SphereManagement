const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    },
    time: { type: String, required: true },
    title: { type: String, required: true },
    speaker: { type: String, required: true },
    location: { type: String, default: "Main Stage" },
    tag: { type: String, default: "Keynote" },
    topic: { type: String, default: "" },
    day: { type: String, default: "Day 1" },
    registered_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.models.Session || mongoose.model("Session", sessionSchema);
