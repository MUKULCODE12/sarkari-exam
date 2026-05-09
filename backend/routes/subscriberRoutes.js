const express = require("express");
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  updatePreferences,
  findByContact
} = require("../controllers/subscriberController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/", subscribe);
router.get("/by-contact", findByContact);

// Public with ID (user can manage their own)
router.put("/:id", updatePreferences);
router.delete("/:id", unsubscribe);

// Admin only
router.get("/", protect, getSubscribers);

module.exports = router;
