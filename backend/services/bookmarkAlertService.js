const User = require("../models/User");
const Job = require("../models/Job");
const UserAlert = require("../models/UserAlert");
const { sendBookmarkAlertEmail } = require("./emailService");
const { generateBookmarkAlertLink } = require("./whatsappService");

/**
 * Map job type to alert type
 */
function getAlertType(jobType) {
  switch (jobType) {
    case "Result": return "result_released";
    case "Admit Card": return "admit_card_released";
    case "Answer Key": return "answer_key_released";
    default: return "new_job";
  }
}

/**
 * Get a human-friendly alert label
 */
function getAlertLabel(alertType) {
  switch (alertType) {
    case "result_released": return "Result Released";
    case "admit_card_released": return "Admit Card Released";
    case "answer_key_released": return "Answer Key Available";
    default: return "New Update";
  }
}

/**
 * Extract keywords from a job title for matching
 * e.g. "SSC CGL Result 2026" → ["SSC", "CGL"]
 */
function extractKeywords(title) {
  const stopWords = ["result", "admit", "card", "answer", "key", "2024", "2025", "2026", "2027",
    "out", "link", "download", "online", "form", "apply", "recruitment",
    "vacancy", "post", "posts", "notification", "released", "declared",
    "marksheet", "scorecard", "hall", "ticket", "exam", "city", "date",
    "cut", "off", "cutoff", "roll", "no", "wise", "list", "final",
    "tier", "phase", "mains", "prelims", "pre", "new"];
  const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
  return words.filter(w => w.length > 1 && !stopWords.includes(w));
}

/**
 * Check if a new job (Result/Admit Card/Answer Key) matches a bookmarked job
 */
function isRelatedJob(newJobTitle, bookmarkedJobTitle) {
  const newKeywords = extractKeywords(newJobTitle);
  const bookmarkedKeywords = extractKeywords(bookmarkedJobTitle);
  if (newKeywords.length === 0 || bookmarkedKeywords.length === 0) return false;
  // Must match at least 2 keywords or 60% of the shorter set
  const matches = newKeywords.filter(k => bookmarkedKeywords.includes(k));
  const threshold = Math.max(2, Math.ceil(Math.min(newKeywords.length, bookmarkedKeywords.length) * 0.5));
  return matches.length >= threshold;
}

/**
 * Main function: When admin creates a Result/Admit Card/Answer Key,
 * notify all users who bookmarked a related exam.
 */
async function notifyBookmarkedUsers(newJob) {
  const alertType = getAlertType(newJob.type);
  const alertLabel = getAlertLabel(alertType);

  console.log(`🔔 Checking bookmark alerts for: "${newJob.title}" (${newJob.type})`);

  try {
    // Find all users who have bookmarks
    const users = await User.find({
      bookmarkedJobs: { $exists: true, $not: { $size: 0 } }
    }).populate("bookmarkedJobs");

    let emailsSent = 0;
    let alertsCreated = 0;
    let whatsappLinks = [];

    for (const user of users) {
      // Check if any of user's bookmarked jobs relate to this new job
      const matchedBookmark = user.bookmarkedJobs.find(bj =>
        isRelatedJob(newJob.title, bj.title)
      );

      if (!matchedBookmark) continue;

      console.log(`  → User ${user.email} has bookmark "${matchedBookmark.title}" matching "${newJob.title}"`);

      // Create in-app alert
      if (user.notifChannels.includes("inapp")) {
        await UserAlert.create({
          userId: user._id,
          jobId: newJob._id,
          alertType,
          title: `${alertLabel}: ${newJob.title}`,
          message: `Great news! ${newJob.title} has been released. Check it now!`
        });
        alertsCreated++;
      }

      // Send email
      if (user.notifChannels.includes("email") && user.email) {
        try {
          await sendBookmarkAlertEmail(user.email, newJob, alertLabel);
          emailsSent++;
        } catch (e) {
          console.error(`  ✗ Email failed for ${user.email}:`, e.message);
        }
      }

      // Generate WhatsApp link
      if (user.notifChannels.includes("whatsapp") && user.phone) {
        const link = generateBookmarkAlertLink(user.phone, newJob, alertLabel);
        whatsappLinks.push({ phone: user.phone, link });
      }
    }

    console.log(`✅ Bookmark alerts: ${alertsCreated} in-app, ${emailsSent} emails, ${whatsappLinks.length} WhatsApp`);
    return { alertsCreated, emailsSent, whatsappLinks };
  } catch (err) {
    console.error("❌ Bookmark alert error:", err);
    return { error: err.message };
  }
}

module.exports = { notifyBookmarkedUsers, isRelatedJob };
