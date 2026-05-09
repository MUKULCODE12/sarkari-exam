const nodemailer = require("nodemailer");

// Create reusable transporter
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || user === "your-email@gmail.com") {
    console.warn("⚠️  SMTP credentials not configured. Emails will be logged but not sent.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  return transporter;
}

// ─── HTML Template Wrapper ───
function wrapHTML(title, bodyContent) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      body { margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7fa; }
      .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #0284c7, #0ea5e9); padding:32px 24px; text-align:center; }
      .header h1 { color:#fff; margin:0; font-size:28px; letter-spacing:1px; }
      .header p { color:#e0f2fe; margin:8px 0 0; font-size:14px; }
      .body { padding:32px 24px; }
      .body h2 { color:#0f172a; margin-top:0; }
      .body p { color:#475569; line-height:1.7; }
      .btn { display:inline-block; padding:14px 32px; background:#0284c7; color:#fff !important; text-decoration:none; border-radius:8px; font-weight:600; margin:16px 0; }
      .btn:hover { background:#0369a1; }
      .footer { background:#f8fafc; padding:20px 24px; text-align:center; border-top:1px solid #e2e8f0; }
      .footer p { color:#94a3b8; font-size:12px; margin:4px 0; }
      .urgent-badge { display:inline-block; background:#ef4444; color:#fff; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
      .countdown { font-size:36px; font-weight:700; color:#ef4444; text-align:center; margin:16px 0; }
      .job-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin:12px 0; }
      .job-card h3 { margin:0 0 8px; color:#0f172a; }
      .job-card p { margin:4px 0; color:#64748b; font-size:14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📋 ExamPortal</h1>
        <p>Your Government Exam Companion</p>
      </div>
      <div class="body">
        <h2>${title}</h2>
        ${bodyContent}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ExamPortal. All rights reserved.</p>
        <p>You received this because you subscribed to exam notifications.</p>
      </div>
    </div>
  </body>
  </html>`;
}

// ─── Send Email Helper ───
async function sendMail(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    return { mock: true, to, subject };
  }

  try {
    const info = await t.sendMail({
      from: `"ExamPortal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    return { error: err.message };
  }
}

// ─── Public Functions ───

async function sendWelcomeEmail(email) {
  const body = `
    <p>Welcome to <strong>ExamPortal</strong>! 🎉</p>
    <p>You've successfully subscribed to exam notifications. Here's what you'll get:</p>
    <ul style="color:#475569; line-height:2;">
      <li>🔔 Instant alerts when new jobs are posted</li>
      <li>⏰ Deadline reminders (7 days, 3 days, 1 day before)</li>
      <li>📊 Results and admit card notifications</li>
    </ul>
    <p>Head over to ExamPortal to track your favourite exams:</p>
    <a href="http://localhost:5173" class="btn">Visit ExamPortal →</a>
    <p style="font-size:13px; color:#94a3b8;">If you didn't subscribe, you can ignore this email.</p>
  `;
  return sendMail(email, "Welcome to ExamPortal! 🎉", wrapHTML("Welcome Aboard!", body));
}

async function sendJobAlertEmail(emails, job) {
  const body = `
    <p>A new government job has been posted! 🚀</p>
    <div class="job-card">
      <h3>${job.title}</h3>
      <p><strong>Category:</strong> ${job.category || "General"}</p>
      <p><strong>Qualification:</strong> ${job.qualification || "N/A"}</p>
      <p><strong>Age Limit:</strong> ${job.ageLimit || "N/A"}</p>
      <p><strong>State:</strong> ${job.state || "All India"}</p>
      <p><strong>Last Date:</strong> ${job.lastDate}</p>
    </div>
    <a href="${job.applyLink && job.applyLink !== '#' ? job.applyLink : 'http://localhost:5173'}" class="btn">Apply Now →</a>
    <p style="font-size:13px; color:#94a3b8;">Don't miss the deadline!</p>
  `;
  const html = wrapHTML("New Job Alert! 🚀", body);
  const results = [];
  for (const email of emails) {
    const r = await sendMail(email, `New Job: ${job.title}`, html);
    results.push(r);
  }
  return results;
}

async function sendDeadlineReminderEmail(email, job, daysLeft) {
  const urgency = daysLeft <= 1 ? "🔴 LAST DAY" : daysLeft <= 3 ? "🟠 URGENT" : "🟡 REMINDER";
  const countdownText = daysLeft <= 1 ? "TODAY is the last day!" : `Only <strong>${daysLeft} day${daysLeft > 1 ? 's' : ''}</strong> left!`;

  const body = `
    <div style="text-align:center; margin-bottom:16px;">
      <span class="urgent-badge">${urgency}</span>
    </div>
    <p style="text-align:center;">${countdownText}</p>
    <div class="countdown">⏰ ${daysLeft} day${daysLeft > 1 ? 's' : ''}</div>
    <div class="job-card">
      <h3>${job.title}</h3>
      <p><strong>Last Date to Apply:</strong> ${job.lastDate}</p>
      <p><strong>Category:</strong> ${job.category || "General"}</p>
      <p><strong>Qualification:</strong> ${job.qualification || "N/A"}</p>
    </div>
    <div style="text-align:center;">
      <a href="${job.applyLink && job.applyLink !== '#' ? job.applyLink : 'http://localhost:5173'}" class="btn" style="background:#ef4444;">Apply Before It's Too Late →</a>
    </div>
    <p style="font-size:13px; color:#94a3b8; text-align:center;">
      You're receiving this because you're tracking "${job.title}" on ExamPortal.
    </p>
  `;
  return sendMail(
    email,
    `⚠️ ${daysLeft} day${daysLeft > 1 ? 's' : ''} left to apply for ${job.title}!`,
    wrapHTML("Deadline Approaching! ⚠️", body)
  );
}

async function sendUnsubscribeConfirmation(email) {
  const body = `
    <p>You have been successfully unsubscribed from ExamPortal notifications.</p>
    <p>We're sorry to see you go! You can always re-subscribe from our website.</p>
    <a href="http://localhost:5173" class="btn">Visit ExamPortal</a>
  `;
  return sendMail(email, "Unsubscribed from ExamPortal", wrapHTML("Goodbye! 👋", body));
}

async function sendBookmarkAlertEmail(email, job, alertLabel) {
  const emoji = alertLabel.includes("Result") ? "🎯" : alertLabel.includes("Admit") ? "🎫" : alertLabel.includes("Answer") ? "📝" : "📢";
  const colorMap = { "Result Released": "#10b981", "Admit Card Released": "#f59e0b", "Answer Key Available": "#8b5cf6" };
  const color = colorMap[alertLabel] || "#0284c7";

  const body = `
    <div style="text-align:center; margin-bottom:16px;">
      <span style="display:inline-block; background:${color}; color:#fff; padding:6px 18px; border-radius:20px; font-size:14px; font-weight:600;">${emoji} ${alertLabel}</span>
    </div>
    <p style="text-align:center; font-size:16px;">Great news! An update is available for an exam you're tracking.</p>
    <div class="job-card" style="border-left: 4px solid ${color};">
      <h3>${job.title}</h3>
      <p><strong>Type:</strong> ${job.type || "Update"}</p>
      <p><strong>Category:</strong> ${job.category || "General"}</p>
      ${job.postCount ? `<p><strong>Posts:</strong> ${job.postCount}</p>` : ""}
      ${job.lastDate ? `<p><strong>Date:</strong> ${job.lastDate}</p>` : ""}
    </div>
    <div style="text-align:center;">
      <a href="${job.sourceUrl || job.applyLink || 'http://localhost:5173'}" class="btn" style="background:${color};">Check Now →</a>
    </div>
    <p style="font-size:13px; color:#94a3b8; text-align:center;">
      You're receiving this because you bookmarked a related exam on ExamPortal.
    </p>
  `;
  return sendMail(
    email,
    `${emoji} ${alertLabel}: ${job.title}`,
    wrapHTML(`${alertLabel}! ${emoji}`, body)
  );
}

module.exports = {
  sendWelcomeEmail,
  sendJobAlertEmail,
  sendDeadlineReminderEmail,
  sendUnsubscribeConfirmation,
  sendBookmarkAlertEmail
};
