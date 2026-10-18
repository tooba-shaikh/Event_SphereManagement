const mongoose = require("mongoose");

const exhibitorApplicationSchema = new mongoose.Schema(
  {
    exhibitor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    },
    company_name: { type: String, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    products: { type: String, default: "" },
    contact_email: { type: String, default: "" },
    contact_phone: { type: String, default: "" },
    website: { type: String, default: "" },
    preferred_booth: { type: String, default: "" },
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    assigned_booth: { type: String, default: "" },
    rejection_reason: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.ExhibitorApplications || mongoose.model("ExhibitorApplications", exhibitorApplicationSchema);