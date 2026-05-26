const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const prisma = require("../lib/prisma");

router.get("/me", protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const today = new Date().toDateString();
    const lastRequest = new Date(user.lastRequestDate).toDateString();
    const requestsToday = today === lastRequest ? user.requestsUsedToday : 0;
    const totalRequests = await prisma.requestLog.count({
      where: { userId: user.id },
    });
    res.json({
      ...user,
      password: undefined,
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
