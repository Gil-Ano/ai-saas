process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION:", err.message);
  console.log(err.stack);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION:", err.message);
  console.log(err.stack);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

try {
  const authRoutes = require("./routes/authRoutes");
  const aiRoutes = require("./routes/aiRoutes");
  const userRoutes = require("./routes/userRoutes");
  const uploadRoutes = require("./routes/uploadRoutes");
  const stripeRoutes = require("./routes/stripeRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/stripe", stripeRoutes);
} catch (err) {
  console.log("ROUTE LOAD ERROR:", err.message);
  console.log(err.stack);
}

app.get("/", (req, res) => {
  res.json({ message: "ClarixAI API running" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
