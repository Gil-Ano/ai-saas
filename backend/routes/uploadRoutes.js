const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/pdf", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (err) {
    res.status(500).json({ message: "Could not parse PDF" });
  }
});

module.exports = router;
