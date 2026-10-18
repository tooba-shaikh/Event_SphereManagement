const mongoose = require("mongoose");

const exhibitorSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    company_name: { type: String, required: true },
    logo: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    products: [
      {
        name: String,
        description: String,
        price: Number,
        image: String
      }
    ],
    contact_email: { type: String, default: "" },
    contact_phone: { type: String, default: "" },
    website: { type: String, default: "" },
    booth: { type: String, default: "" },
    expo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Exhibitor || mongoose.model("Exhibitor", exhibitorSchema);