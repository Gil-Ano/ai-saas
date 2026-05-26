const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../lib/prisma");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Attempting to find user:", email);
    const exists = await prisma.user.findUnique({ where: { email } });
    console.log("Found:", exists);
    if (exists) return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const apiKey = crypto.randomBytes(32).toString("hex");
    const user = await prisma.user.create({
      data: { name, email, password: hashed, apiKey },
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        apiKey: user.apiKey,
      },
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err.message);
    console.log("FULL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        apiKey: user.apiKey,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
