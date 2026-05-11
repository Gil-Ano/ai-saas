const express = require("express");
const router = express.Router();
const { protect, checkLimit } = require("../middleware/authMiddleware");
const User = require("../models/User");
const RequestLog = require("../models/RequestLog");

const callGroq = async (prompt) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    },
  );
  const data = await response.json();
  return data.choices[0].message.content;
};

const logAndRespond = async (req, res, tool, prompt) => {
  try {
    const result = await callGroq(prompt);
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { requestsUsedToday: 1 },
    });
    await RequestLog.create({
      user: req.user._id,
      tool,
      prompt,
      response: result,
    });
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.post("/resume-analyzer", protect, checkLimit, async (req, res) => {
  const { resume, jobDescription } = req.body;
  const prompt = `Analyze this resume against the job description and provide:
1. Match score (0-100)
2. Missing skills
3. Strengths
4. Specific improvements

Resume: ${resume}

Job Description: ${jobDescription}

Format your response clearly with sections.`;
  await logAndRespond(req, res, "resume-analyzer", prompt);
});

router.post("/cover-letter", protect, checkLimit, async (req, res) => {
  const { resume, jobDescription, companyName } = req.body;
  const prompt = `Write a professional cover letter for this job application.
Company: ${companyName}
Job Description: ${jobDescription}
Resume/Background: ${resume}

Write a compelling, personalized cover letter that highlights relevant experience.`;
  await logAndRespond(req, res, "cover-letter", prompt);
});

router.post("/interview-questions", protect, checkLimit, async (req, res) => {
  const { jobTitle, skills } = req.body;
  const prompt = `Generate 10 interview questions for a ${jobTitle} position.
Key skills required: ${skills}

Include a mix of technical, behavioral and situational questions. For each question provide a brief tip on how to answer it well.`;
  await logAndRespond(req, res, "interview-questions", prompt);
});

router.post("/content-rewriter", protect, checkLimit, async (req, res) => {
  const { content, tone, type } = req.body;
  const prompt = `Rewrite the following ${type} in a ${tone} tone. Make it engaging, clear and professional.

Original content: ${content}

Provide the rewritten version only.`;
  await logAndRespond(req, res, "content-rewriter", prompt);
});

router.post("/code-explainer", protect, checkLimit, async (req, res) => {
  const { code, language } = req.body;
  const prompt = `Explain this ${language} code in simple terms that a junior developer can understand.

Code:
${code}

Explain:
1. What the code does overall
2. Each important part/function
3. Any potential issues or improvements`;
  await logAndRespond(req, res, "code-explainer", prompt);
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
