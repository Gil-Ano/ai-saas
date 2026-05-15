const express = require("express");
const router = express.Router();
const { protect, checkLimit } = require("../middleware/authMiddleware");
const User = require("../models/User");
const RequestLog = require("../models/RequestLog");

const PYTHON_ENGINE = "http://localhost:8000";

const callPython = async (endpoint, data) => {
  const response = await fetch(`${PYTHON_ENGINE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.detail || "Python engine error");
  return result.result;
};

const logAndRespond = async (req, res, tool, endpoint, data) => {
  try {
    const result = await callPython(endpoint, data);
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { requestsUsedToday: 1 },
    });
    await RequestLog.create({
      user: req.user._id,
      tool,
      response: result,
    });
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.post("/resume-analyzer", protect, checkLimit, async (req, res) => {
  await logAndRespond(req, res, "resume-analyzer", "analyze-resume", req.body);
});

router.post("/cover-letter", protect, checkLimit, async (req, res) => {
  await logAndRespond(req, res, "cover-letter", "cover-letter", req.body);
});

router.post("/interview-questions", protect, checkLimit, async (req, res) => {
  await logAndRespond(
    req,
    res,
    "interview-questions",
    "interview-questions",
    req.body,
  );
});

router.post("/content-rewriter", protect, checkLimit, async (req, res) => {
  await logAndRespond(
    req,
    res,
    "content-rewriter",
    "content-rewriter",
    req.body,
  );
});

router.post("/code-explainer", protect, checkLimit, async (req, res) => {
  await logAndRespond(req, res, "code-explainer", "code-explainer", req.body);
});

router.get("/history", protect, async (req, res) => {
  try {
    const logs = await RequestLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
