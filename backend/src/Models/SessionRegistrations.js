const mongoose = require("mongoose");

const sessionRegistrationSchema = new mongoose.Schema(
  {
    attendee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true
    },
    status: {
      type: String,
      enum: ["bookmarked", "registered", "attended", "cancelled"],
      default: "bookmarked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.SessionRegistration || mongoose.model("SessionRegistration", sessionRegistrationSchema);
