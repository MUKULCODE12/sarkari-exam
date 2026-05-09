import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, Briefcase, Calendar, Bell, Users, LogOut, RefreshCw, Send } from 'lucide-react';
import { useToast } from '../components/Toast';

interface AdminDashboardProps {
  darkMode: boolean;
  adminToken: string | null;
  setAdminToken: (t: string | null) => void;
}

const API = 'http://localhost:5000';

export default function AdminDashboard({ darkMode, adminToken, setAdminToken }: AdminDashboardProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'jobs' | 'events' | 'notifications' | 'subscribers'>('jobs');
  const [stats, setStats] = useState({ totalJobs: 0, totalEvents: 0, totalNotifications: 0, totalSubscribers: 0 });
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [form, setForm] = useState<any>({});

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` };

  useEffect(() => {
    if (!adminToken) { navigate('/admin'); return; }
    fetchStats();
  }, [adminToken]);

  useEffect(() => { fetchItems(); }, [tab]);

  async function fetchStats() {
    try {
      const r = await fetch(`${API}/api/stats`);
      setStats(await r.json());
    } catch {}
  }

  async function fetchItems() {
    setLoading(true);
    const endpoints: Record<string, string> = {
      jobs: '/api/jobs', events: '/api/events',
      notifications: '/api/notifications', subscribers: '/api/subscribers'
    };
    try {
      const h = tab === 'subscribers' ? { Authorization: `Bearer ${adminToken}` } : {};
      const r = await fetch(`${API}${endpoints[tab]}`, { headers: h as any });
      setItems(await r.json());
    } catch { setItems([]); }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    const endpoints: Record<string, string> = {
      jobs: '/api/jobs', events: '/api/events', notifications: '/api/notifications', subscribers: '/api/subscribers'
    };
    try {
      await fetch(`${API}${endpoints[tab]}/${id}`, { method: 'DELETE', headers });
      showToast('Deleted successfully', 'success');
      fetchItems();
      fetchStats();
    } catch { showToast('Delete failed', 'error'); }
  }

  async function handleSave() {
    const endpoints: Record<string, string> = {
      jobs: '/api/jobs', events: '/api/events', notifications: '/api/notifications'
    };
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `${API}${endpoints[tab]}/${editId}` : `${API}${endpoints[tab]}`;
      const r = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!r.ok) { const d = await r.json(); showToast(d.message || 'Failed', 'error'); return; }
      showToast(editId ? 'Updated!' : 'Created!', 'success');
      setShowForm(false); setEditId(null); setForm({});
      fetchItems(); fetchStats();
    } catch { showToast('Save failed', 'error'); }
  }

  async function handleSeed() {
    try {
      await fetch(`${API}/api/seed`, { method: 'POST' });
      showToast('Database seeded!', 'success');
      fetchItems(); fetchStats();
    } catch { showToast('Seed failed', 'error'); }
  }

  async function triggerReminders() {
    try {
      const r = await fetch(`${API}/api/reminders/check`, { method: 'POST', headers });
      const d = await r.json();
      showToast(`Sent ${d.emailsSent || 0} emails, ${d.whatsappLinks?.length || 0} WhatsApp links`, 'info');
    } catch { showToast('Reminder check failed', 'error'); }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    navigate('/admin');
  }

  function startEdit(item: any) {
    setForm({ ...item }); setEditId(item._id); setShowForm(true);
  }

  function startNew() {
    setForm({}); setEditId(null); setShowForm(true);
  }

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const txt = darkMode ? 'text-white' : 'text-gray-900';
  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';

  const statCards = [
    { label: 'Jobs', value: stats.totalJobs, icon: Briefcase, color: 'from-sky-500 to-blue-600' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'from-emerald-500 to-green-600' },
    { label: 'Alerts', value: stats.totalNotifications, icon: Bell, color: 'from-amber-500 to-orange-600' },
    { label: 'Subscribers', value: stats.totalSubscribers, icon: Users, color: 'from-purple-500 to-indigo-600' },
  ];

  const tabs = [
    { key: 'jobs', label: 'Jobs', icon: Briefcase },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'subscribers', label: 'Subscribers', icon: Users },
  ] as const;

  return (
    <div className={`min-h-screen py-8 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${txt}`}>Admin Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={handleSeed} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
              <RefreshCw className="h-4 w-4" /> Seed DB
            </button>
            <button onClick={triggerReminders} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
              <Send className="h-4 w-4" /> Send Reminders
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className={`p-5 rounded-xl border ${card}`}>
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${s.color} mb-3`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className={`text-2xl font-bold ${txt}`}>{s.value}</p>
              <p className={`text-sm ${sub}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-6 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setShowForm(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? 'bg-sky-600 text-white shadow' : `${sub} hover:${txt}`
              }`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`rounded-xl border ${card}`}>
          {/* Toolbar */}
          {tab !== 'subscribers' && (
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
              <p className={`font-medium ${txt}`}>{items.length} {tab}</p>
              <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700">
                <Plus className="h-4 w-4" /> Add New
              </button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="p-6 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
              <h3 className={`font-semibold mb-4 ${txt}`}>{editId ? 'Edit' : 'Create'} {tab.slice(0, -1)}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tab === 'jobs' && <>
                  <input placeholder="Title" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Category (SSC, Railway...)" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Last Date (e.g. 15 Jun 2026)" value={form.lastDate || ''} onChange={e => setForm({ ...form, lastDate: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Apply Link" value={form.applyLink || ''} onChange={e => setForm({ ...form, applyLink: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Qualification" value={form.qualification || ''} onChange={e => setForm({ ...form, qualification: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Age Limit" value={form.ageLimit || ''} onChange={e => setForm({ ...form, ageLimit: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="State" value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Department" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <label className="flex items-center gap-2 col-span-full">
                    <input type="checkbox" checked={form.isTrending || false} onChange={e => setForm({ ...form, isTrending: e.target.checked })} />
                    <span className={txt}>Trending</span>
                  </label>
                </>}
                {tab === 'events' && <>
                  <input placeholder="Title" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input type="date" value={form.date ? form.date.split('T')[0] : ''} onChange={e => setForm({ ...form, date: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <select value={form.type || ''} onChange={e => setForm({ ...form, type: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}>
                    <option value="">Type</option>
                    <option value="exam">Exam</option><option value="result">Result</option>
                    <option value="admit">Admit Card</option><option value="application">Application</option>
                  </select>
                  <select value={form.color || ''} onChange={e => setForm({ ...form, color: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}>
                    <option value="">Color</option>
                    <option value="bg-blue-500">Blue</option><option value="bg-green-500">Green</option>
                    <option value="bg-yellow-500">Yellow</option><option value="bg-red-500">Red</option>
                  </select>
                </>}
                {tab === 'notifications' && <>
                  <input placeholder="Title" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <input placeholder="Time text (e.g. 2 hours ago)" value={form.timeText || ''} onChange={e => setForm({ ...form, timeText: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <select value={form.type || ''} onChange={e => setForm({ ...form, type: e.target.value })} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}>
                    <option value="">Type</option>
                    <option value="admit">Admit</option><option value="result">Result</option>
                    <option value="application">Application</option><option value="exam">Exam</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.urgent || false} onChange={e => setForm({ ...form, urgent: e.target.checked })} />
                    <span className={txt}>Urgent</span>
                  </label>
                </>}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSave} className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700">Save</button>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className={`px-6 py-2 rounded-lg font-medium border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'}`}>Cancel</button>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="divide-y" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
            {loading ? <p className={`p-6 ${sub}`}>Loading...</p> :
              items.length === 0 ? <p className={`p-6 ${sub}`}>No items found</p> :
              items.map((item: any) => (
                <div key={item._id} className={`flex items-center justify-between p-4 hover:${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium truncate ${txt}`}>{item.title || item.email || 'Untitled'}</p>
                    <p className={`text-sm truncate ${sub}`}>
                      {tab === 'jobs' && `${item.category || ''} • ${item.lastDate || ''} • ${item.state || ''}`}
                      {tab === 'events' && `${item.type || ''} • ${item.date ? new Date(item.date).toLocaleDateString() : ''}`}
                      {tab === 'notifications' && `${item.type || ''} • ${item.timeText || ''} ${item.urgent ? '• ⚠️ Urgent' : ''}`}
                      {tab === 'subscribers' && `${item.phone || ''} • Channels: ${item.channels?.join(', ') || 'none'} • Exams: ${item.trackedExams?.length || 0}`}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    {tab !== 'subscribers' && (
                      <button onClick={() => startEdit(item)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
