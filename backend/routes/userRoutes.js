const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const RequestLog = require("../models/RequestLog");

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const today = new Date().toDateString();
    const lastRequest = new Date(user.lastRequestDate).toDateString();
    const requestsToday = today === lastRequest ? user.requestsUsedToday : 0;
    const totalRequests = await RequestLog.countDocuments({
      user: req.user._id,
    });
    res.json({
      ...user.toObject(),
      requestsToday,
      totalRequests,
      remainingRequests:
        user.plan === "pro" ? "Unlimited" : Math.max(0, 5 - requestsToday),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
