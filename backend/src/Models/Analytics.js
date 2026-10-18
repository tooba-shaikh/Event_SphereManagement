const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    },
    total_attendees: { type: Number, default: 0 },
    total_exhibitors: { type: Number, default: 0 },
    total_booths: { type: Number, default: 0 },
    occupied_booths: { type: Number, default: 0 },
    session_registrations: { type: Number, default: 0 },
    booth_visits: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);
