const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    },
    booth_number: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "Standard (10x10)"
    },
    location: {
      type: String,
      default: "Main Hall"
    },
    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available"
    },
    exhibitor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibitor",
      default: null
    },
    exhibitor_name: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Booth || mongoose.model("Booth", boothSchema);
