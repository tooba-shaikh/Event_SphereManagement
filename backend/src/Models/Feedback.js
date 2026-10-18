const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "General Feedback" },
    message: { type: String, required: true },
    rating: { type: Number, default: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
