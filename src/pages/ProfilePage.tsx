import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Bell, MessageSquare, CheckCircle, LogOut, Bookmark, Clock, Settings, BellRing, Eye } from 'lucide-react';
import { useToast } from '../components/Toast';
import JobCard from '../components/JobCard';
import { Job } from '../App';

interface ProfilePageProps {
  darkMode: boolean;
  user: any;
  userToken: string | null;
  onLogout: () => void;
  bookmarks: string[];
  toggleBookmark: (job: Job) => void;
}

export default function ProfilePage({ darkMode, user, userToken, onLogout, bookmarks, toggleBookmark }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);
  const [notifChannels, setNotifChannels] = useState<string[]>(user?.notifChannels || ['inapp']);
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const headers = { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!userToken) { navigate('/login'); return; }
    // Fetch alerts
    fetch('http://localhost:5000/api/users/alerts', { headers }).then(r => r.json()).then(data => { if (Array.isArray(data)) setAlerts(data); }).catch(() => {});
    // Fetch bookmarks
    fetch('http://localhost:5000/api/users/bookmarks', { headers }).then(r => r.json()).then(data => { if (Array.isArray(data)) setBookmarkedJobs(data); }).catch(() => {});
    // Fetch unread count
    fetch('http://localhost:5000/api/users/alerts/unread-count', { headers }).then(r => r.json()).then(data => setUnreadCount(data.count || 0)).catch(() => {});
  }, [userToken]);

  const handleSavePrefs = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT', headers, body: JSON.stringify({ notifChannels, phone })
      });
      if (res.ok) { showToast('Preferences saved!', 'success'); } else { showToast('Failed to save', 'error'); }
    } catch { showToast('Server error', 'error'); }
    setSaving(false);
  };

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:5000/api/users/alerts/read-all', { method: 'PUT', headers });
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
      setUnreadCount(0);
      showToast('All alerts marked as read', 'info');
    } catch {}
  };

  const markOneRead = async (alertId: string) => {
    try {
      await fetch(`http://localhost:5000/api/users/alerts/${alertId}/read`, { method: 'PUT', headers });
      setAlerts(prev => prev.map(a => a._id === alertId ? { ...a, isRead: true } : a));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const toggleChannel = (ch: string) => {
    setNotifChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  if (!user) return <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : ''}`}><p>Please <a href="/login" className="text-sky-500 underline">login</a> first.</p></div>;

  const tabCls = (tab: string) => `flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? (darkMode ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-700') : (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}`;

  const alertTypeColors: Record<string, string> = { result_released: 'bg-emerald-500', admit_card_released: 'bg-amber-500', answer_key_released: 'bg-violet-500', new_job: 'bg-sky-500', deadline_reminder: 'bg-red-500' };
  const alertTypeLabels: Record<string, string> = { result_released: '🎯 Result', admit_card_released: '🎫 Admit Card', answer_key_released: '📝 Answer Key', new_job: '📢 New Job', deadline_reminder: '⏰ Deadline' };

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className={`p-6 rounded-2xl mb-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-3">
              <div className={`text-center px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{bookmarkedJobs.length}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bookmarks</p>
              </div>
              <div className={`text-center px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-lg font-bold ${unreadCount > 0 ? 'text-amber-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>{unreadCount}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unread</p>
              </div>
            </div>
            <button onClick={() => { onLogout(); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium transition-colors">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('alerts')} className={tabCls('alerts')}><BellRing className="h-4 w-4" /> Alerts {unreadCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}</button>
          <button onClick={() => setActiveTab('bookmarks')} className={tabCls('bookmarks')}><Bookmark className="h-4 w-4" /> Bookmarks</button>
          <button onClick={() => setActiveTab('settings')} className={tabCls('settings')}><Settings className="h-4 w-4" /> Notification Settings</button>
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className={`rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Alerts</h2>
              {unreadCount > 0 && <button onClick={markAllRead} className="text-sm text-sky-500 hover:underline">Mark all read</button>}
            </div>
            <div className="divide-y divide-gray-700/30 max-h-[500px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className={`h-12 w-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No alerts yet</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Bookmark exams to get notified when results or admit cards are released</p>
                </div>
              ) : alerts.map(alert => (
                <div key={alert._id} className={`p-4 flex items-start gap-3 transition-colors ${!alert.isRead ? (darkMode ? 'bg-sky-500/5' : 'bg-sky-50') : ''}`}>
                  <span className={`mt-1 shrink-0 h-2.5 w-2.5 rounded-full ${alert.isRead ? 'bg-transparent' : alertTypeColors[alert.alertType] || 'bg-sky-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{alertTypeLabels[alert.alertType] || '📢 Update'}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(alert.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className={`font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{alert.title}</p>
                    <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alert.message}</p>
                  </div>
                  {!alert.isRead && <button onClick={() => markOneRead(alert._id)} className="shrink-0 p-1 rounded hover:bg-gray-700/30"><Eye className="h-4 w-4 text-gray-400" /></button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            {bookmarkedJobs.length === 0 ? (
              <div className={`text-center py-16 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <Bookmark className={`h-12 w-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No bookmarks yet</p>
                <button onClick={() => navigate('/jobs')} className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700">Browse Jobs</button>
              </div>
            ) : bookmarkedJobs.map((job: any) => (
              <JobCard key={job._id} job={job} darkMode={darkMode} isBookmarked={bookmarks.includes(job._id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose how you want to receive alerts when results, admit cards, or answer keys are released for your bookmarked exams.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { id: 'inapp', label: 'In-App Alerts', desc: 'Bell icon notifications', icon: Bell, color: 'sky' },
                { id: 'email', label: 'Email Alerts', desc: 'Detailed email notifications', icon: Mail, color: 'blue' },
                { id: 'whatsapp', label: 'WhatsApp', desc: 'Instant WhatsApp messages', icon: MessageSquare, color: 'green' },
              ].map(ch => (
                <div key={ch.id} onClick={() => toggleChannel(ch.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${notifChannels.includes(ch.id) ? (darkMode ? `border-${ch.color}-500 bg-${ch.color}-500/10` : `border-${ch.color}-500 bg-${ch.color}-50`) : (darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50')}`}>
                  <div className="flex items-center justify-between mb-2">
                    <ch.icon className={`h-6 w-6 ${notifChannels.includes(ch.id) ? `text-${ch.color}-500` : 'text-gray-400'}`} />
                    {notifChannels.includes(ch.id) && <CheckCircle className={`h-5 w-5 text-${ch.color}-500`} />}
                  </div>
                  <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ch.label}</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ch.desc}</p>
                </div>
              ))}
            </div>
            {notifChannels.includes('whatsapp') && (
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>WhatsApp Number</label>
                <div className="relative max-w-xs">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
              </div>
            )}
            <button onClick={handleSavePrefs} disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
