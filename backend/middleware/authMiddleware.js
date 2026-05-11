const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const checkLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const today = new Date().toDateString();
    const lastRequest = new Date(user.lastRequestDate).toDateString();

    if (today !== lastRequest) {
      user.requestsUsedToday = 0;
      user.lastRequestDate = new Date();
      await user.save();
    }

    if (user.plan === "free" && user.requestsUsedToday >= 5) {
      return res.status(429).json({
        message: "Daily limit reached. Upgrade to Pro for unlimited requests.",
        limitReached: true,
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { protect, checkLimit };
