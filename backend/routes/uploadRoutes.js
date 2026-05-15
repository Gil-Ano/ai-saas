const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });
const PYTHON_ENGINE = "http://localhost:8000";

router.post("/pdf", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const FormData = (await import("node-fetch")).default;
    const fetch = (await import("node-fetch")).default;

    const formData = new (require("form-data"))();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch(`${PYTHON_ENGINE}/upload-pdf`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ message: data.detail });
    res.json({ text: data.text });
  } catch (err) {
    console.log("Upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
