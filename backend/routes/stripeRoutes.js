const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const prisma = require("../lib/prisma");
const { sendUpgradeEmail } = require("../lib/email");

router.post("/create-checkout", protect, async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: { userId: req.user.id },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.log("STRIPE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const user = await prisma.user.update({
        where: { id: session.metadata.userId },
        data: {
          plan: "pro",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        },
      });
      await sendUpgradeEmail(user.email, user.name);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: "free" },
      });
    }

    res.json({ received: true });
  },
);

module.exports = router;
