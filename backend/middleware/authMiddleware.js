const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
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
      await prisma.user.update({
        where: { id: user.id },
        data: { requestsUsedToday: 0, lastRequestDate: new Date() },
      });
      req.user.requestsUsedToday = 0;
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
