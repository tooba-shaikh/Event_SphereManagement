const mongoose = require("mongoose");

const expoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    theme: { type: String, required: true },
    category: { type: String, default: "General" },
    date: { type: String, required: true },
    start_time: { type: String, default: "09:00 AM" },
    end_time: { type: String, default: "05:00 PM" },
    location: { type: String, required: true },
    city: { type: String, default: "Karachi" },
    banner_image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming"
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Expo || mongoose.model("Expo", expoSchema);