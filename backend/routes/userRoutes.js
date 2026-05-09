const express = require("express");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  getProfile,
  updateProfile,
  addBookmark,
  removeBookmark,
  getBookmarks,
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
  getUnreadCount
} = require("../controllers/userController");

const router = express.Router();

// User auth middleware (separate from admin protect)
function userAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/profile", userAuth, getProfile);
router.put("/profile", userAuth, updateProfile);
router.post("/bookmarks/:jobId", userAuth, addBookmark);
router.delete("/bookmarks/:jobId", userAuth, removeBookmark);
router.get("/bookmarks", userAuth, getBookmarks);
router.get("/alerts", userAuth, getAlerts);
router.put("/alerts/read-all", userAuth, markAllAlertsRead);
router.get("/alerts/unread-count", userAuth, getUnreadCount);
router.put("/alerts/:alertId/read", userAuth, markAlertRead);

module.exports = router;
