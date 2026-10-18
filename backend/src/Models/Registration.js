const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true
    },
    bookmarked_sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
      }
    ],
    status: {
      type: String,
      enum: ["registered", "cancelled", "attended"],
      default: "registered"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
