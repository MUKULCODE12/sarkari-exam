const Subscriber = require("../models/Subscriber");
const { sendWelcomeEmail, sendUnsubscribeConfirmation } = require("../services/emailService");
const { generateWelcomeLink, generateSubscribeLink } = require("../services/whatsappService");

// POST /api/subscribers — Subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email, phone, channels, trackedExams } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone number is required" });
    }
    if (!channels || channels.length === 0) {
      return res.status(400).json({ message: "At least one notification channel is required" });
    }

    // Check for existing subscriber
    let subscriber = await Subscriber.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (subscriber) {
      // Update existing
      if (email) subscriber.email = email;
      if (phone) subscriber.phone = phone;
      subscriber.channels = [...new Set([...subscriber.channels, ...channels])];
      if (trackedExams) {
        subscriber.trackedExams = [...new Set([...subscriber.trackedExams, ...trackedExams])];
      }
      subscriber.isActive = true;
      await subscriber.save();
    } else {
      // Create new
      subscriber = await Subscriber.create({
        email,
        phone,
        channels,
        trackedExams: trackedExams || [],
        isActive: true
      });
    }

    // Send welcome email
    let emailResult = null;
    if (channels.includes("email") && email) {
      emailResult = await sendWelcomeEmail(email);
    }

    // Generate WhatsApp link
    let whatsappLink = null;
    if (channels.includes("whatsapp") && phone) {
      whatsappLink = generateWelcomeLink(phone);
    }

    res.status(201).json({
      message: "Subscribed successfully!",
      subscriber,
      whatsappLink,
      emailSent: !!emailResult
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: "Failed to subscribe" });
  }
};

// DELETE /api/subscribers/:id — Unsubscribe
exports.unsubscribe = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    subscriber.isActive = false;
    await subscriber.save();

    // Send confirmation email
    if (subscriber.email) {
      await sendUnsubscribeConfirmation(subscriber.email);
    }

    res.json({ message: "Unsubscribed successfully" });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).json({ message: "Failed to unsubscribe" });
  }
};

// GET /api/subscribers — List all (admin)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
};

// PUT /api/subscribers/:id — Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { channels, trackedExams } = req.body;
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    if (channels) subscriber.channels = channels;
    if (trackedExams) subscriber.trackedExams = trackedExams;
    await subscriber.save();

    res.json({ message: "Preferences updated", subscriber });
  } catch (err) {
    res.status(500).json({ message: "Failed to update preferences" });
  }
};

// GET /api/subscribers/by-contact — Find subscriber by email or phone
exports.findByContact = async (req, res) => {
  try {
    const { email, phone } = req.query;
    let subscriber = null;

    if (email) {
      subscriber = await Subscriber.findOne({ email, isActive: true });
    } else if (phone) {
      subscriber = await Subscriber.findOne({ phone, isActive: true });
    }

    if (!subscriber) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(subscriber);
  } catch (err) {
    res.status(500).json({ message: "Failed to find subscriber" });
  }
};
