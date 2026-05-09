/**
 * WhatsApp Service
 * Uses wa.me deep links to open WhatsApp Web with pre-filled messages.
 * No paid API needed — works via URL scheme.
 */

const PORTAL_NUMBER = process.env.WHATSAPP_NUMBER || "919876543210";

function cleanPhone(phone) {
  // Remove spaces, dashes, plus sign — keep just digits
  return phone.replace(/[\s\-\+]/g, "");
}

function generateWelcomeLink(phone) {
  const cleanNum = cleanPhone(phone);
  const message = encodeURIComponent(
    `🎉 Welcome to ExamPortal!\n\n` +
    `You've subscribed to exam notifications via WhatsApp.\n\n` +
    `You'll receive:\n` +
    `🔔 New job alerts\n` +
    `⏰ Deadline reminders\n` +
    `📊 Results & admit card updates\n\n` +
    `Visit: http://localhost:5173\n` +
    `Reply STOP to unsubscribe.`
  );
  return `https://wa.me/${cleanNum}?text=${message}`;
}

function generateSubscribeLink() {
  const message = encodeURIComponent(
    `SUBSCRIBE\n\nHi! I want to subscribe to ExamPortal notifications. Please add me to the alert list.`
  );
  return `https://wa.me/${PORTAL_NUMBER}?text=${message}`;
}

function generateJobAlertLink(phone, job) {
  const cleanNum = cleanPhone(phone);
  const message = encodeURIComponent(
    `🚀 *New Job Alert from ExamPortal!*\n\n` +
    `📋 *${job.title}*\n` +
    `📂 Category: ${job.category || "General"}\n` +
    `🎓 Qualification: ${job.qualification || "N/A"}\n` +
    `📅 Last Date: ${job.lastDate}\n` +
    `🏛️ State: ${job.state || "All India"}\n\n` +
    `Apply Now: ${job.applyLink && job.applyLink !== "#" ? job.applyLink : "http://localhost:5173"}\n\n` +
    `— ExamPortal`
  );
  return `https://wa.me/${cleanNum}?text=${message}`;
}

function generateDeadlineReminderLink(phone, job, daysLeft) {
  const cleanNum = cleanPhone(phone);
  const urgency = daysLeft <= 1 ? "🔴 LAST DAY" : daysLeft <= 3 ? "🟠 URGENT" : "🟡 REMINDER";
  const message = encodeURIComponent(
    `${urgency}\n\n` +
    `⏰ *${daysLeft} day${daysLeft > 1 ? "s" : ""} left to apply!*\n\n` +
    `📋 *${job.title}*\n` +
    `📅 Last Date: ${job.lastDate}\n\n` +
    `Don't miss the deadline!\n` +
    `Apply Now: ${job.applyLink && job.applyLink !== "#" ? job.applyLink : "http://localhost:5173"}\n\n` +
    `— ExamPortal`
  );
  return `https://wa.me/${cleanNum}?text=${message}`;
}

function generateBroadcastLinks(phones, job) {
  return phones.map(phone => ({
    phone,
    link: generateJobAlertLink(phone, job)
  }));
}

function generateBroadcastMessage(job) {
  return (
    `🚀 *New Job Alert from ExamPortal!*\n\n` +
    `📋 *${job.title}*\n` +
    `📂 Category: ${job.category || "General"}\n` +
    `🎓 Qualification: ${job.qualification || "N/A"}\n` +
    `📅 Last Date: ${job.lastDate}\n` +
    `🏛️ State: ${job.state || "All India"}\n\n` +
    `Apply Now: ${job.applyLink && job.applyLink !== "#" ? job.applyLink : "http://localhost:5173"}\n\n` +
    `— ExamPortal`
  );
}

function generateBookmarkAlertLink(phone, job, alertLabel) {
  const cleanNum = cleanPhone(phone);
  const emoji = alertLabel.includes("Result") ? "🎯" : alertLabel.includes("Admit") ? "🎫" : alertLabel.includes("Answer") ? "📝" : "📢";
  const message = encodeURIComponent(
    `${emoji} *${alertLabel} — ExamPortal Alert!*\n\n` +
    `📋 *${job.title}*\n` +
    `📂 Type: ${job.type || "Update"}\n` +
    `📂 Category: ${job.category || "General"}\n` +
    `${job.postCount ? `👥 Posts: ${job.postCount}\n` : ""}` +
    `${job.lastDate ? `📅 Date: ${job.lastDate}\n` : ""}\n` +
    `Check Now: ${job.sourceUrl || job.applyLink || "http://localhost:5173"}\n\n` +
    `You bookmarked a related exam on ExamPortal.\n` +
    `— ExamPortal`
  );
  return `https://wa.me/${cleanNum}?text=${message}`;
}

module.exports = {
  generateWelcomeLink,
  generateSubscribeLink,
  generateJobAlertLink,
  generateDeadlineReminderLink,
  generateBroadcastLinks,
  generateBroadcastMessage,
  generateBookmarkAlertLink
};
