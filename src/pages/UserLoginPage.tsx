import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, User as UserIcon, Phone, Bell, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

interface UserLoginPageProps {
  darkMode: boolean;
  onLogin: (token: string, user: any) => void;
}

export default function UserLoginPage({ darkMode, onLogin }: UserLoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifChannels, setNotifChannels] = useState<string[]>(['inapp']);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const toggleChannel = (ch: string) => {
    setNotifChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { showToast('Please fill all required fields', 'warning'); return; }
    if (isRegister && !name) { showToast('Please enter your name', 'warning'); return; }
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/users/register' : '/api/users/login';
      const body: any = { email, password };
      if (isRegister) { body.name = name; body.phone = phone; body.notifChannels = notifChannels; }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || 'Authentication failed', 'error'); setLoading(false); return; }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      onLogin(data.token, data.user);
      showToast(isRegister ? 'Account created successfully! 🎉' : 'Welcome back! 🎉', 'success');
      navigate('/profile');
    } catch { showToast('Server error. Is the backend running?', 'error'); }
    setLoading(false);
  };

  const inputCls = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-sky-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sky-50 to-blue-50'}`}>
      <div className={`w-full max-w-md mx-4 p-8 rounded-2xl border shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 mb-4 shadow-lg">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isRegister ? 'Sign up to bookmark exams & get alerts' : 'Login to access your bookmarks & alerts'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className={inputCls} />
            </div>
          )}
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className={inputCls} />
          </div>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={`${inputCls} pr-12`} />
            <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {isRegister && (
            <>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="WhatsApp Number (optional)" className={inputCls} />
              </div>

              <div>
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Get notified via:</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'inapp', label: 'In-App', icon: Bell, color: 'sky' },
                    { id: 'email', label: 'Email', icon: Mail, color: 'blue' },
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'green' },
                  ].map(ch => (
                    <button key={ch.id} type="button" onClick={() => toggleChannel(ch.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        notifChannels.includes(ch.id)
                          ? `border-${ch.color}-500 bg-${ch.color}-500/10 text-${ch.color}-${darkMode ? '400' : '600'}`
                          : darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                      }`}>
                      {notifChannels.includes(ch.id) && <CheckCircle className="h-3.5 w-3.5" />}
                      <ch.icon className="h-3.5 w-3.5" /> {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 shadow-lg">
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className={`text-sm font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} hover:underline`}>
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
