const cron = require("node-cron");
const Job = require("../models/Job");
const Subscriber = require("../models/Subscriber");
const { sendDeadlineReminderEmail } = require("./emailService");
const { generateDeadlineReminderLink } = require("./whatsappService");

/**
 * Check if a reminder was already sent for this job + threshold.
 */
function alreadySent(subscriber, jobId, daysThreshold) {
  return subscriber.remindersSent.some(
    r => r.jobId.toString() === jobId.toString() && r.daysBeforeDeadline === daysThreshold
  );
}

/**
 * Parse lastDate string (e.g. "15 Jun 2026") into a Date object.
 */
function parseLastDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  // Try manual parse "DD Mon YYYY"
  const parts = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (parts) {
    return new Date(`${parts[2]} ${parts[1]}, ${parts[3]}`);
  }
  return null;
}

/**
 * Calculate days between today and a target date.
 */
function daysUntil(targetDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

/**
 * Core function: check all jobs and send reminders.
 */
async function checkAndSendReminders() {
  console.log("🔔 Running deadline reminder check...");

  try {
    const jobs = await Job.find();
    const thresholds = [7, 3, 1];
    let emailsSent = 0;
    let whatsappLinks = [];

    for (const job of jobs) {
      const lastDate = parseLastDate(job.lastDate);
      if (!lastDate) continue;

      const days = daysUntil(lastDate);

      // Check if this job matches any threshold
      const matchedThreshold = thresholds.find(t => days === t);
      if (matchedThreshold === undefined) continue;

      console.log(`⏰ ${job.title}: ${days} day(s) until deadline`);

      // Find subscribers tracking this exam
      const subscribers = await Subscriber.find({
        isActive: true,
        trackedExams: { $regex: new RegExp(job.title.split(" ")[0], "i") }
      });

      for (const sub of subscribers) {
        if (alreadySent(sub, job._id, matchedThreshold)) continue;

        // Send email reminder
        if (sub.channels.includes("email") && sub.email) {
          await sendDeadlineReminderEmail(sub.email, job, matchedThreshold);
          emailsSent++;
        }

        // Generate WhatsApp reminder link
        if (sub.channels.includes("whatsapp") && sub.phone) {
          const link = generateDeadlineReminderLink(sub.phone, job, matchedThreshold);
          whatsappLinks.push({ phone: sub.phone, job: job.title, days: matchedThreshold, link });
        }

        // Mark as sent
        sub.remindersSent.push({
          jobId: job._id,
          daysBeforeDeadline: matchedThreshold,
          sentAt: new Date()
        });
        await sub.save();
      }
    }

    console.log(`✅ Reminder check complete: ${emailsSent} emails sent, ${whatsappLinks.length} WhatsApp links generated`);
    return { emailsSent, whatsappLinks };
  } catch (err) {
    console.error("❌ Deadline reminder error:", err);
    return { error: err.message };
  }
}

/**
 * Start the daily cron job.
 * Runs every day at 9:00 AM IST (3:30 AM UTC).
 */
function startDeadlineReminderCron() {
  // Run at 9:00 AM every day (adjust timezone as needed)
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Cron triggered: Daily deadline reminder check");
    await checkAndSendReminders();
  }, {
    timezone: "Asia/Kolkata"
  });
  console.log("✅ Deadline reminder cron scheduled (daily at 9:00 AM IST)");
}

module.exports = {
  checkAndSendReminders,
  startDeadlineReminderCron
};
