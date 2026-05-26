const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: "ClarixAI <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to ClarixAI",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Welcome to ClarixAI, ${name}!</h1>
          <p>Your account is ready. You have <strong>5 free AI requests per day</strong> to use across all our tools.</p>
          <h3>What you can do:</h3>
          <ul>
            <li>Analyze your resume against any job description</li>
            <li>Generate tailored cover letters</li>
            <li>Practice with AI interview questions</li>
            <li>Rewrite content in any tone</li>
            <li>Explain any code in plain English</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}" style="background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">Go to Dashboard</a>
          <p style="color: #666; margin-top: 24px; font-size: 14px;">Need more requests? <a href="${process.env.FRONTEND_URL}/pricing">Upgrade to Pro</a> for unlimited access.</p>
        </div>
      `,
    });
  } catch (err) {
    console.log("Email error:", err.message);
  }
};

const sendUpgradeEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: "ClarixAI <onboarding@resend.dev>",
      to: email,
      subject: "You are now on ClarixAI Pro!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">You are now Pro, ${name}!</h1>
          <p>Thank you for upgrading to ClarixAI Pro. You now have <strong>unlimited AI requests</strong> every day.</p>
          <h3>Your Pro benefits:</h3>
          <ul>
            <li>Unlimited AI requests per day</li>
            <li>Priority processing</li>
            <li>Early access to new tools</li>
            <li>Full request history</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}" style="background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 16px;">Go to Dashboard</a>
        </div>
      `,
    });
  } catch (err) {
    console.log("Email error:", err.message);
  }
};

module.exports = { sendWelcomeEmail, sendUpgradeEmail };
