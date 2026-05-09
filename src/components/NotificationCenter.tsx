import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, Settings, CheckCircle, X, Plus, Phone } from 'lucide-react';
import { useToast } from './Toast';

interface NotificationCenterProps {
  darkMode: boolean;
}

const EXAM_LIST = [
  'SSC CGL 2026', 'SSC CHSL 2026', 'SSC MTS 2026',
  'IBPS PO 2026', 'IBPS Clerk 2026', 'SBI PO 2026',
  'UPSC IAS Prelims 2026', 'UPSC IAS Mains 2026',
  'RRB NTPC 2026', 'Railway Group D 2026',
  'NDA 2026', 'CDS 2026',
  'UP Police 2026', 'Delhi Police SI 2026',
  'BPSC Teacher 2026', 'UPPSC PCS 2026',
  'GATE 2026', 'RBI Grade B 2026'
];

export default function NotificationCenter({ darkMode }: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState('setup');
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const { showToast } = useToast();

  // Subscription state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [subscriberId, setSubscriberId] = useState<string | null>(null);
  const [trackedExams, setTrackedExams] = useState<string[]>([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [examSearch, setExamSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('notifPrefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (prefs.email) setEmail(prefs.email);
        if (prefs.phone) setPhone(prefs.phone);
        if (prefs.emailEnabled) setEmailEnabled(true);
        if (prefs.whatsappEnabled) setWhatsappEnabled(true);
        if (prefs.subscriberId) setSubscriberId(prefs.subscriberId);
        if (prefs.trackedExams) setTrackedExams(prefs.trackedExams);
      } catch {}
    }
  }, []);

  // Save preferences to localStorage
  const saveLocal = (updates: any) => {
    const current = { email, phone, emailEnabled, whatsappEnabled, subscriberId, trackedExams, ...updates };
    localStorage.setItem('notifPrefs', JSON.stringify(current));
  };

  // Fetch recent alerts
  useEffect(() => {
    if (activeTab === 'recent') {
      fetch('https://sarkari-exam-backend.onrender.com/api/notifications')
        .then(r => r.json())
        .then(data => setRecentAlerts(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [activeTab]);

  // Subscribe handler
  const handleSubscribe = async () => {
    const channels: string[] = [];
    if (emailEnabled) channels.push('email');
    if (whatsappEnabled) channels.push('whatsapp');

    if (channels.length === 0) { showToast('Select at least one notification channel', 'warning'); return; }
    if (emailEnabled && !email) { showToast('Enter your email address', 'warning'); return; }
    if (whatsappEnabled && !phone) { showToast('Enter your WhatsApp number', 'warning'); return; }
    if (emailEnabled && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Enter a valid email', 'warning'); return; }
    if (whatsappEnabled && phone && !/^\+?\d{10,13}$/.test(phone.replace(/\s/g, ''))) { showToast('Enter a valid phone (e.g. +919876543210)', 'warning'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('https://sarkari-exam-backend.onrender.com/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailEnabled ? email : undefined, phone: whatsappEnabled ? phone : undefined, channels, trackedExams })
      });
      const data = await res.json();

      if (!res.ok) { showToast(data.message || 'Subscription failed', 'error'); setSubmitting(false); return; }

      setSubscriberId(data.subscriber._id);
      saveLocal({ subscriberId: data.subscriber._id, emailEnabled, whatsappEnabled });

      if (data.emailSent) showToast('✅ Welcome email sent! Check your inbox.', 'success');
      else if (emailEnabled) showToast('✅ Subscribed via Email! (Configure SMTP to send emails)', 'success');

      // Open WhatsApp link if subscribed via WhatsApp
      if (data.whatsappLink && whatsappEnabled) {
        showToast('Opening WhatsApp...', 'info');
        window.open(data.whatsappLink, '_blank');
      }

      if (!emailEnabled && !data.whatsappLink) showToast('Subscribed successfully!', 'success');
    } catch {
      showToast('Server error. Is the backend running?', 'error');
    }
    setSubmitting(false);
  };

  // Unsubscribe
  const handleUnsubscribe = async () => {
    if (!subscriberId) return;
    try {
      await fetch(`https://sarkari-exam-backend.onrender.com/api/subscribers/${subscriberId}`, { method: 'DELETE' });
      setSubscriberId(null);
      setEmailEnabled(false);
      setWhatsappEnabled(false);
      saveLocal({ subscriberId: null, emailEnabled: false, whatsappEnabled: false });
      showToast('Unsubscribed successfully', 'info');
    } catch { showToast('Unsubscribe failed', 'error'); }
  };

  // Update tracked exams
  const addExam = async (exam: string) => {
    if (trackedExams.includes(exam)) return;
    const updated = [...trackedExams, exam];
    setTrackedExams(updated);
    saveLocal({ trackedExams: updated });

    if (subscriberId) {
      try {
        await fetch(`https://sarkari-exam-backend.onrender.com/api/subscribers/${subscriberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackedExams: updated })
        });
      } catch {}
    }
    showToast(`Now tracking "${exam}"`, 'success');
    setShowExamModal(false);
    setExamSearch('');
  };

  const removeExam = async (exam: string) => {
    const updated = trackedExams.filter(e => e !== exam);
    setTrackedExams(updated);
    saveLocal({ trackedExams: updated });

    if (subscriberId) {
      try {
        await fetch(`https://sarkari-exam-backend.onrender.com/api/subscribers/${subscriberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackedExams: updated })
        });
      } catch {}
    }
    showToast(`Removed "${exam}" from tracking`, 'info');
  };

  const filteredExams = EXAM_LIST.filter(e => !trackedExams.includes(e) && e.toLowerCase().includes(examSearch.toLowerCase()));
  const isSubscribed = !!subscriberId;

  return (
    <section className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Notification Center</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Never miss important exam updates</p>
        </div>

        <div className={`rounded-xl shadow-lg ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          {/* Tabs */}
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button onClick={() => setActiveTab('setup')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'setup'
                  ? darkMode ? 'bg-gray-800 text-sky-400 border-b-2 border-sky-400' : 'bg-gray-50 text-sky-600 border-b-2 border-sky-600'
                  : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Settings className="h-5 w-5 mx-auto mb-1" /> Setup Alerts
            </button>
            <button onClick={() => setActiveTab('recent')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'recent'
                  ? darkMode ? 'bg-gray-800 text-sky-400 border-b-2 border-sky-400' : 'bg-gray-50 text-sky-600 border-b-2 border-sky-600'
                  : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Bell className="h-5 w-5 mx-auto mb-1" /> Recent Alerts
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'setup' && (
              <div className="space-y-6">
                {/* Subscription Status */}
                {isSubscribed && (
                  <div className={`p-4 rounded-xl border ${darkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className={`font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>You're subscribed!</span>
                      <button onClick={handleUnsubscribe} className="ml-auto text-sm text-red-500 hover:underline">Unsubscribe</button>
                    </div>
                  </div>
                )}

                {/* Notification Channels */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Choose Notification Channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WhatsApp */}
                    <div className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      whatsappEnabled
                        ? darkMode ? 'border-green-500 bg-green-500/10' : 'border-green-500 bg-green-50'
                        : darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`} onClick={() => setWhatsappEnabled(!whatsappEnabled)}>
                      <div className="flex items-center justify-between mb-3">
                        <MessageSquare className={`h-8 w-8 ${whatsappEnabled ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        {whatsappEnabled && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                      <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>WhatsApp</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get instant alerts on WhatsApp</p>
                      {whatsappEnabled && (
                        <div className="mt-3" onClick={e => e.stopPropagation()}>
                          <div className="relative">
                            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => { setPhone(e.target.value); saveLocal({ phone: e.target.value }); }}
                              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      emailEnabled
                        ? darkMode ? 'border-sky-500 bg-sky-500/10' : 'border-sky-500 bg-sky-50'
                        : darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`} onClick={() => setEmailEnabled(!emailEnabled)}>
                      <div className="flex items-center justify-between mb-3">
                        <Mail className={`h-8 w-8 ${emailEnabled ? 'text-sky-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        {emailEnabled && <CheckCircle className="h-5 w-5 text-sky-500" />}
                      </div>
                      <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Detailed notifications via email</p>
                      {emailEnabled && (
                        <div className="mt-3" onClick={e => e.stopPropagation()}>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); saveLocal({ email: e.target.value }); }}
                              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracked Exams */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Tracked Exams</h3>
                  <div className="space-y-2">
                    {trackedExams.length === 0 ? (
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No exams tracked yet. Add exams to get deadline reminders.</p>
                    ) : trackedExams.map(exam => (
                      <div key={exam} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{exam}</span>
                        <button onClick={() => removeExam(exam)}
                          className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowExamModal(true)}
                    className={`mt-4 w-full py-2 px-4 rounded-lg border-2 border-dashed font-medium transition-colors flex items-center justify-center gap-2 ${
                      darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}>
                    <Plus className="h-4 w-4" /> Add Exams to Track
                  </button>
                </div>

                {/* Save / Subscribe Button */}
                <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button onClick={handleSubscribe} disabled={submitting}
                    className="w-full py-3 px-6 rounded-xl font-semibold transition-all bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 disabled:opacity-50 shadow-lg">
                    {submitting ? 'Subscribing...' : isSubscribed ? 'Update Subscription' : 'Subscribe to Notifications'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'recent' && (
              <div className="space-y-4">
                {recentAlerts.length > 0 ? recentAlerts.map((n, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    n.urgent
                      ? darkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'
                      : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{n.title}</h4>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{n.timeText || n.time}</p>
                      </div>
                      {n.urgent && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Urgent</span>}
                    </div>
                  </div>
                )) : (
                  <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No recent alerts</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Exam Selection Modal */}
        {showExamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowExamModal(false)}>
            <div className={`max-w-md w-full mx-4 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add Exams to Track</h3>
                <button onClick={() => setShowExamModal(false)} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <input type="text" placeholder="Search exams..." value={examSearch} onChange={e => setExamSearch(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border mb-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredExams.map(exam => (
                    <button key={exam} onClick={() => addExam(exam)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                      {exam}
                    </button>
                  ))}
                  {filteredExams.length === 0 && (
                    <p className={`text-center py-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No exams found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}