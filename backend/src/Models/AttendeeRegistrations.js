const mongoose = require("mongoose");

const attendeeRegistrationSchema = new mongoose.Schema(
  {
    attendee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true
    },
    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.AttendeeRegistration || mongoose.model("AttendeeRegistration", attendeeRegistrationSchema);
