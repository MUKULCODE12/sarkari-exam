import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useToast } from '../components/Toast';

interface AdminLoginPageProps {
  darkMode: boolean;
  setAdminToken: (token: string | null) => void;
}

export default function AdminLoginPage({ darkMode, setAdminToken }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { showToast('Please fill all fields', 'warning'); return; }
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/admin/register' : '/api/admin/login';
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Authentication failed', 'error');
        setLoading(false);
        return;
      }

      if (isRegister) {
        showToast('Registration successful! Please login.', 'success');
        setIsRegister(false);
      } else {
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        showToast('Login successful!', 'success');
        navigate('/admin/dashboard');
      }
    } catch {
      showToast('Server error. Is the backend running?', 'error');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md mx-4 p-8 rounded-2xl border shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isRegister ? 'Create Admin Account' : 'Admin Login'}
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isRegister ? 'Register a new admin account' : 'Access the admin dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@examportal.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
              <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all disabled:opacity-50">
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className={`text-sm font-medium ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>

        {!isRegister && (
          <div className={`mt-4 p-3 rounded-lg text-xs text-center ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            Default: admin@examportal.com / admin123
          </div>
        )}
      </div>
    </div>
  );
}
