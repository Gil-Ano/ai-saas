const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tool: { type: String, required: true },
    prompt: { type: String },
    response: { type: String },
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RequestLog", requestLogSchema);
