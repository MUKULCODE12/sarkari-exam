const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();
const fmt = (date) => date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const jobs = [
  // ── LATEST JOBS ──
  { title: "CRPF Constable Tradesman Recruitment 2026", category: "Defence", postCount: "9195 Post", lastDate: fmt(new Date(y, m+1, 20)), applyLink: "#", qualification: "10th Pass", ageLimit: "18-25 years", state: "All India", department: "Police", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/crpf-constable-tradesman-recruitment-2026/" },
  { title: "RRB ALP Recruitment 2026", category: "Railway", postCount: "11127 Post", lastDate: fmt(new Date(y, m+1, 15)), applyLink: "#", qualification: "10th Pass + ITI", ageLimit: "18-30 years", state: "All India", department: "Transport", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/rrb-alp-recruitment-2026/" },
  { title: "UPCISB Cooperative Bank Recruitment 2026", category: "Banking", postCount: "2085 Post", lastDate: fmt(new Date(y, m, d+10)), applyLink: "#", qualification: "Graduate", ageLimit: "21-40 years", state: "Uttar Pradesh", department: "Bank", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/upcisb-cooperative-bank-recruitment-2026/" },
  { title: "SSC Stenographer Recruitment 2026", category: "SSC", postCount: "731 Post", lastDate: fmt(new Date(y, m+1, 5)), applyLink: "#", qualification: "12th Pass", ageLimit: "18-27 years", state: "All India", department: "Revenue", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/ssc-stenographer-recruitment-2026/" },
  { title: "Rajasthan LDC Recruitment 2026", category: "State PSC", postCount: "10644 Post", lastDate: fmt(new Date(y, m+2, 1)), applyLink: "#", qualification: "12th Pass", ageLimit: "18-40 years", state: "Rajasthan", department: "Revenue", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/rajasthan-ldc-recruitment-2026/" },
  { title: "SSC Phase 14 Recruitment 2026", category: "SSC", postCount: "3003 Post", lastDate: fmt(new Date(y, m+1, 10)), applyLink: "#", qualification: "Graduate", ageLimit: "18-30 years", state: "All India", department: "Revenue", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/ssc-phase-14-recruitment-2026/" },
  { title: "UPSSSC Lower PCS Recruitment 2026", category: "State PSC", postCount: "2285 Post", lastDate: fmt(new Date(y, m+1, 25)), applyLink: "#", qualification: "Graduate", ageLimit: "21-40 years", state: "Uttar Pradesh", department: "Education", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/upsssc-lower-pcs-recruitment-2026/" },
  { title: "Union Bank of India Apprentice 2026", category: "Banking", postCount: "1865 Post", lastDate: fmt(new Date(y, m, d+7)), applyLink: "#", qualification: "Graduate", ageLimit: "20-28 years", state: "All India", department: "Bank", isTrending: false, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/union-bank-of-india-apprentice-vacancy-2026/" },
  { title: "RBI Officer Grade B Recruitment 2026", category: "Banking", postCount: "N/A", lastDate: fmt(new Date(y, m+2, 10)), applyLink: "#", qualification: "Post Graduate", ageLimit: "21-30 years", state: "All India", department: "Bank", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/rbi-officer-grade-b-recruitment-2026/" },
  { title: "UPTET 2026 Online Form", category: "Teaching", postCount: "N/A", lastDate: fmt(new Date(y, m, d+14)), applyLink: "#", qualification: "Graduate + BEd", ageLimit: "18-35 years", state: "Uttar Pradesh", department: "Education", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/uptet-2026-online-form/" },
  { title: "MPESB Van Rakshak Jail Prahari 2026", category: "Police", postCount: "1679 Post", lastDate: fmt(new Date(y, m+1, 8)), applyLink: "#", qualification: "12th Pass", ageLimit: "18-25 years", state: "Madhya Pradesh", department: "Police", isTrending: false, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/mpesb-van-rakshak-jail-prahari-recruitment-2026/" },
  { title: "NTPC Assistant Executive Recruitment 2026", category: "Engineering", postCount: "250 Post", lastDate: fmt(new Date(y, m+1, 12)), applyLink: "#", qualification: "Graduate", ageLimit: "21-30 years", state: "All India", department: "Energy", isTrending: false, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/ntpc-assistant-executive-recruitment-2026/" },
  { title: "UP Anganwadi Bharti 2026", category: "State PSC", postCount: "61601 Post", lastDate: fmt(new Date(y, m+2, 5)), applyLink: "#", qualification: "10th Pass", ageLimit: "21-45 years", state: "Uttar Pradesh", department: "Social Welfare", isTrending: true, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/up-anganwadi-bharti-2026/" },
  { title: "Punjab PSPCL JE Electrical 2026", category: "Engineering", postCount: "622 Post", lastDate: fmt(new Date(y, m, d+12)), applyLink: "#", qualification: "Diploma/BTech", ageLimit: "18-37 years", state: "Punjab", department: "Energy", isTrending: false, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/punjab-pspcl-je-electrical-recruitment-2026/" },
  { title: "Assam Police Constable 2026", category: "Police", postCount: "1715 Post", lastDate: fmt(new Date(y, m+1, 18)), applyLink: "#", qualification: "12th Pass", ageLimit: "18-25 years", state: "Assam", department: "Police", isTrending: false, type: "Latest Job", sourceUrl: "https://sarkariresult.com.im/assam-police-constable-recruitment/" },

  // ── RESULTS ──
  { title: "SSC CHSL 10+2 Tier-I Result 2026", category: "SSC", lastDate: "", applyLink: "#", state: "All India", department: "Revenue", isTrending: true, type: "Result", sourceUrl: "https://sarkariresult.com.im/ssc-chsl-result-2026/" },
  { title: "UP Board 12th Result 2026", category: "Board", lastDate: "", applyLink: "#", state: "Uttar Pradesh", department: "Education", isTrending: true, type: "Result", sourceUrl: "https://sarkariresult.com.im/up-board-12th-result-2026-link-upmsp-intermediate-marksheet-download/" },
  { title: "CBSE 10th Result 2026", category: "Board", lastDate: "", applyLink: "#", state: "All India", department: "Education", isTrending: true, type: "Result", sourceUrl: "https://sarkariresult.com.im/cbse-10th-result-2026-link/" },
  { title: "UP Police SI ASI Final Result 2026", category: "Police", lastDate: "", applyLink: "#", state: "Uttar Pradesh", department: "Police", isTrending: false, type: "Result", sourceUrl: "https://sarkariresult.com.im/up-police-si-asi-result/" },
  { title: "CTET 2026 Result", category: "Teaching", lastDate: "", applyLink: "#", state: "All India", department: "Education", isTrending: false, type: "Result", sourceUrl: "https://sarkariresult.com.im/ctet-2026-result/" },
  { title: "MP Police Constable Final Result 2026", category: "Police", lastDate: "", applyLink: "#", state: "Madhya Pradesh", department: "Police", isTrending: false, type: "Result", sourceUrl: "https://sarkariresult.com.im/mp-police-constable-result-2026/" },

  // ── ADMIT CARDS ──
  { title: "RRB NTPC 12th Level Admit Card 2026", category: "Railway", lastDate: "", applyLink: "#", state: "All India", department: "Transport", isTrending: true, type: "Admit Card", sourceUrl: "https://sarkariresult.com.im/rrb-ntpc-12th-level-admit-card-exam-city/" },
  { title: "SSC GD Constable Admit Card 2026", category: "SSC", lastDate: "", applyLink: "#", state: "All India", department: "Police", isTrending: true, type: "Admit Card", sourceUrl: "https://sarkariresult.com.im/ssc-gd-constable-admit-card-2026/" },
  { title: "NTA NEET UG 2026 Admit Card", category: "Medical", lastDate: "", applyLink: "#", state: "All India", department: "Education", isTrending: true, type: "Admit Card", sourceUrl: "https://sarkariresult.com.im/nta-neet-ug-2026-admit-card/" },
  { title: "CUET UG Admit Card 2026", category: "University", lastDate: "", applyLink: "#", state: "All India", department: "Education", isTrending: false, type: "Admit Card", sourceUrl: "https://sarkariresult.com.im/cuet-ug-exam-city-admit-card-2026/" },
  { title: "UPPSC LT Grade Teacher Admit Card 2026", category: "Teaching", lastDate: "", applyLink: "#", state: "Uttar Pradesh", department: "Education", isTrending: false, type: "Admit Card", sourceUrl: "https://sarkariresult.com.im/uppsc-lt-grade-teacher-admit-card/" },

  // ── ANSWER KEYS ──
  { title: "RRB ALP CBT-1 Answer Key 2026", category: "Railway", lastDate: "", applyLink: "#", state: "All India", department: "Transport", isTrending: false, type: "Answer Key", sourceUrl: "https://sarkariresult.com.im/rrb-alp-answer-key-2026/" },
  { title: "UP Police SI Answer Key 2026", category: "Police", lastDate: "", applyLink: "#", state: "Uttar Pradesh", department: "Police", isTrending: false, type: "Answer Key", sourceUrl: "https://sarkariresult.com.im/up-police-si-answer-key-2026/" },
  { title: "CTET February Answer Key 2026", category: "Teaching", lastDate: "", applyLink: "#", state: "All India", department: "Education", isTrending: false, type: "Answer Key", sourceUrl: "https://sarkariresult.com.im/ctet-february-answer-key-2026/" },

  // ── ADMISSIONS ──
  { title: "NEET UG 2026 Admission Online Form", category: "Medical", lastDate: fmt(new Date(y, m, d+5)), applyLink: "#", qualification: "12th Pass (PCB)", state: "All India", department: "Education", isTrending: true, type: "Admission", sourceUrl: "https://sarkariresult.com.im/neet-ug-2026-online-form/" },
  { title: "Bihar ITI CAT Admission 2026", category: "ITI", postCount: "33108 Seats", lastDate: fmt(new Date(y, m+1, 1)), applyLink: "#", qualification: "10th Pass", state: "Bihar", department: "Education", isTrending: false, type: "Admission", sourceUrl: "https://sarkariresult.com.im/bihar-iti-cat-admission-form-2026/" },
  { title: "UP BEd Online Form 2026", category: "Teaching", lastDate: fmt(new Date(y, m, d+10)), applyLink: "#", qualification: "Graduate", state: "Uttar Pradesh", department: "Education", isTrending: false, type: "Admission", sourceUrl: "https://sarkariresult.com.im/up-bed-online-form-2026/" },

  // ── YOJANA ──
  { title: "PM Kisan 21st Instalment Status 2025", category: "Yojana", lastDate: "", applyLink: "#", state: "All India", department: "Agriculture", isTrending: true, type: "Yojana", sourceUrl: "https://sarkariresult.com.im/pradhan-mantri-kisan-samman-nidhi-yojana/" },
  { title: "UP Scholarship 2025-26 Online Form", category: "Yojana", lastDate: fmt(new Date(y, m+1, 30)), applyLink: "#", qualification: "All", state: "Uttar Pradesh", department: "Education", isTrending: false, type: "Yojana", sourceUrl: "https://sarkariresult.com.im/up-scholarship-online-form/" },
];

const events = [
  { title: "SSC GD Constable Exam 2026", date: new Date(y, m, d + 5), type: "exam", color: "bg-blue-500" },
  { title: "RRB NTPC 12th Level Exam", date: new Date(y, m, d + 8), type: "exam", color: "bg-blue-500" },
  { title: "NTA NEET UG 2026 Exam", date: new Date(y, m, d + 12), type: "exam", color: "bg-blue-500" },
  { title: "CUET UG Exam 2026", date: new Date(y, m, d + 15), type: "exam", color: "bg-blue-500" },
  { title: "SSC CHSL Tier-I Result", date: new Date(y, m, d + 3), type: "result", color: "bg-green-500" },
  { title: "UP Board 10th/12th Result", date: new Date(y, m, d + 2), type: "result", color: "bg-green-500" },
  { title: "CRPF Tradesman Application Deadline", date: new Date(y, m+1, 20), type: "application", color: "bg-red-500" },
  { title: "RRB ALP Application Deadline", date: new Date(y, m+1, 15), type: "application", color: "bg-red-500" },
  { title: "UPPSC LT Grade Teacher Admit Card", date: new Date(y, m, d + 6), type: "admit", color: "bg-yellow-500" },
  { title: "Rajasthan LDC Application Deadline", date: new Date(y, m+2, 1), type: "application", color: "bg-red-500" },
];

const notifications = [
  { title: "CRPF Constable Tradesman 9195 Posts – Apply Now!", timeText: "1 hour ago", type: "application", urgent: true },
  { title: "RRB ALP 11127 Posts – Registration Open", timeText: "3 hours ago", type: "application", urgent: true },
  { title: "SSC CHSL Tier-I Result 2026 Declared", timeText: "5 hours ago", type: "result", urgent: true },
  { title: "NTA NEET UG 2026 Admit Card OUT", timeText: "1 day ago", type: "admit", urgent: true },
  { title: "UP Board 12th Result 2026 Released", timeText: "1 day ago", type: "result", urgent: false },
  { title: "SSC GD Constable Admit Card Available", timeText: "2 days ago", type: "admit", urgent: false },
  { title: "Rajasthan LDC 10644 Posts – Last Date Approaching", timeText: "2 days ago", type: "application", urgent: true },
  { title: "CBSE 10th Result 2026 Declared", timeText: "3 days ago", type: "result", urgent: false },
  { title: "RRB ALP CBT-1 Answer Key Released", timeText: "3 days ago", type: "application", urgent: false },
  { title: "PM Kisan 21st Instalment Status Available", timeText: "4 days ago", type: "application", urgent: false },
];

module.exports = { jobs, events, notifications };
