import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider, useToast } from "./components/Toast";

import HomePage from "./pages/HomePage";
import AllJobsPage from "./pages/AllJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import BookmarksPage from "./pages/BookmarksPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserLoginPage from "./pages/UserLoginPage";
import ProfilePage from "./pages/ProfilePage";

export type Job = {
  _id: string;
  id?: number;
  title: string;
  category: string;
  lastDate: string;
  applyLink: string;
  qualification?: string;
  ageLimit?: string;
  state?: string;
  department?: string;
  isTrending?: boolean;
  type?: string;
  postCount?: string;
  sourceUrl?: string;
};

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { showToast } = useToast();

  // Load dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  // Load admin token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setAdminToken(token);
  }, []);

  // Load user token & data
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const data = localStorage.getItem("userData");
    if (token) setUserToken(token);
    if (data) { try { setUser(JSON.parse(data)); } catch {} }
  }, []);

  // Load bookmarks
  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try { setBookmarks(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Fetch bookmarked job details
  useEffect(() => {
    if (bookmarks.length === 0) { setBookmarkedJobs([]); return; }
    Promise.all(
      bookmarks.map(id =>
        fetch(`https://sarkari-exam-backend.onrender.com/api/jobs/${id}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => setBookmarkedJobs(results.filter(Boolean)));
  }, [bookmarks]);

  // Fetch jobs
  useEffect(() => {
    setLoading(true);
    const params: any = { ...filters };
    if (searchQuery) params.search = searchQuery;
    const query = new URLSearchParams(params).toString();
    const url = `https://sarkari-exam-backend.onrender.com/api/jobs${query ? '?' + query : ''}`;

    fetch(url)
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filters, searchQuery]);

  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("darkMode", JSON.stringify(newVal));
  };

  const toggleBookmark = useCallback((job: Job) => {
    setBookmarks(prev => {
      const exists = prev.includes(job._id);
      const updated = exists ? prev.filter(id => id !== job._id) : [...prev, job._id];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      showToast(exists ? `Removed "${job.title}" from bookmarks` : `Bookmarked "${job.title}"`, exists ? 'info' : 'success');

      // Sync with server if user is logged in
      if (userToken) {
        const method = exists ? 'DELETE' : 'POST';
        fetch(`https://sarkari-exam-backend.onrender.com/api/users/bookmarks/${job._id}`, {
          method, headers: { 'Authorization': `Bearer ${userToken}` }
        }).catch(() => {});
      }

      return updated;
    });
  }, [showToast, userToken]);

  const handleUserLogin = (token: string, userData: any) => {
    setUserToken(token);
    setUser(userData);
    // Sync server bookmarks to local
    if (userData.bookmarkedJobs?.length > 0) {
      const serverIds = userData.bookmarkedJobs.map((j: any) => typeof j === 'string' ? j : j._id);
      const merged = [...new Set([...bookmarks, ...serverIds])];
      setBookmarks(merged);
      localStorage.setItem("bookmarks", JSON.stringify(merged));
    }
  };

  const handleUserLogout = () => {
    setUserToken(null);
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    showToast("Logged out successfully", "info");
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          bookmarkCount={bookmarks.length}
          user={user}
          userToken={userToken}
        />

        <main>
          <Routes>
            <Route path="/" element={
              <HomePage
                darkMode={darkMode} jobs={jobs} loading={loading}
                filters={filters} setFilters={setFilters}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                bookmarks={bookmarks} toggleBookmark={toggleBookmark}
              />
            } />
            <Route path="/jobs" element={
              <AllJobsPage darkMode={darkMode} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            } />
            <Route path="/jobs/:id" element={
              <JobDetailPage darkMode={darkMode} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            } />
            <Route path="/bookmarks" element={
              <BookmarksPage darkMode={darkMode} bookmarks={bookmarks} bookmarkedJobs={bookmarkedJobs} toggleBookmark={toggleBookmark} />
            } />
            <Route path="/login" element={
              <UserLoginPage darkMode={darkMode} onLogin={handleUserLogin} />
            } />
            <Route path="/profile" element={
              <ProfilePage darkMode={darkMode} user={user} userToken={userToken} onLogout={handleUserLogout} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            } />
            <Route path="/admin" element={
              <AdminLoginPage darkMode={darkMode} setAdminToken={setAdminToken} />
            } />
            <Route path="/admin/dashboard" element={
              <AdminDashboard darkMode={darkMode} adminToken={adminToken} setAdminToken={setAdminToken} />
            } />
          </Routes>
        </main>

        <Footer darkMode={darkMode} setSearchQuery={setSearchQuery} />
        <ScrollToTop />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;