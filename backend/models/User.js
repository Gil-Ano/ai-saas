const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    requestsUsedToday: { type: Number, default: 0 },
    lastRequestDate: { type: Date, default: Date.now },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    apiKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
