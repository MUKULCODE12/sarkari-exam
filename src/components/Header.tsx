import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, X, Moon, Sun, Bookmark, Shield, Home, Briefcase, LogIn, UserCircle } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  bookmarkCount?: number;
  user?: any;
  userToken?: string | null;
}

export default function Header({ darkMode, toggleDarkMode, searchQuery, setSearchQuery, bookmarkCount = 0, user, userToken }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://sarkari-exam-backend.onrender.com/api/notifications')
      .then(r => r.json())
      .then(data => setNotifications(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => {});
  }, []);

  // Fetch user unread alerts count
  useEffect(() => {
    if (userToken) {
      fetch('https://sarkari-exam-backend.onrender.com/api/users/alerts/unread-count', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      }).then(r => r.json()).then(data => setUnreadCount(data.count || 0)).catch(() => {});
    }
  }, [userToken]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('trending-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'All Jobs', icon: Briefcase },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  const totalBadge = (notifications.filter(n => n.urgent).length || notifications.length) + unreadCount;

  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-lg shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${darkMode ? 'from-sky-400 to-blue-400' : 'from-sky-600 to-blue-600'} bg-clip-text text-transparent`}>
              ExamPortal
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                <link.icon className="h-4 w-4" />
                {link.label}
                {link.to === '/bookmarks' && bookmarkCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{bookmarkCount}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} h-4 w-4`} />
              <input type="text" placeholder="Search exams..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Right Items */}
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
                className={`relative p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Bell className="h-5 w-5" />
                {totalBadge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalBadge > 9 ? '9+' : totalBadge}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-3 border-b font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                    Recent Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className={`p-3 border-b last:border-0 ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <div className="flex items-start gap-2">
                          {n.urgent && <span className="shrink-0 mt-0.5 h-2 w-2 rounded-full bg-red-500" />}
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{n.title}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.timeText}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className={`p-4 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notifications</p>
                    )}
                  </div>
                  {user && unreadCount > 0 && (
                    <Link to="/profile" onClick={() => setShowNotifs(false)}
                      className={`block p-3 text-center text-sm font-medium border-t ${darkMode ? 'border-gray-700 text-sky-400 hover:bg-gray-700' : 'border-gray-200 text-sky-600 hover:bg-gray-50'}`}>
                      View {unreadCount} personal alert{unreadCount > 1 ? 's' : ''} →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                {user ? (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </button>
              {showProfile && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {user ? (
                    <>
                      <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setShowProfile(false)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <UserCircle className="h-4 w-4" /> My Profile & Alerts
                      </Link>
                      <Link to="/bookmarks" onClick={() => setShowProfile(false)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <Bookmark className="h-4 w-4" /> Bookmarks ({bookmarkCount})
                      </Link>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setShowProfile(false)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${darkMode ? 'text-emerald-400 hover:bg-gray-700' : 'text-emerald-600 hover:bg-gray-50'}`}>
                      <LogIn className="h-4 w-4" /> Login / Sign Up
                    </Link>
                  )}
                  <Link to="/admin" onClick={() => setShowProfile(false)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm border-t ${darkMode ? 'text-gray-300 hover:bg-gray-700 border-gray-700' : 'text-gray-700 hover:bg-gray-50 border-gray-200'}`}>
                    <Shield className="h-4 w-4" /> Admin Panel
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} h-4 w-4`} />
            <input type="text" placeholder="Search exams..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm ${
                darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 py-3 space-y-1">
            {[...navLinks, ...(user ? [{ to: '/profile', label: 'Profile', icon: UserCircle }] : [{ to: '/login', label: 'Login', icon: LogIn }]), { to: '/admin', label: 'Admin', icon: Shield }].map(link => (
              <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}