import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Briefcase, Award } from 'lucide-react';

interface HeroBannerProps {
  darkMode: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HeroBanner({ darkMode, searchQuery, setSearchQuery, onSearch }: HeroBannerProps) {
  const [stats, setStats] = useState({ totalJobs: 0, totalEvents: 0, totalSubscribers: 0 });

  useEffect(() => {
    fetch('https://sarkari-exam-backend.onrender.com/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats({ totalJobs: 15, totalEvents: 8, totalSubscribers: 100 }));
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-sky-950 to-gray-900'
          : 'bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700'
      }`} />
      
      {/* Animated orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-sky-400/10 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl animate-float-delayed" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-white/90 font-medium">
              India's #1 Government Exam Portal
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Gateway to
            <span className="block bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Sarkari Naukri
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Get latest government job notifications, exam dates, results, admit cards & more — all in one place.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search exams, results, admit cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSearch();
                }}
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-sky-300/50 focus:outline-none shadow-xl text-lg"
              />
              <button
                onClick={onSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="h-5 w-5 text-sky-300 mr-2" />
                <span className="text-3xl font-bold text-white">
                  <AnimatedCounter end={stats.totalJobs || 15} suffix="+" />
                </span>
              </div>
              <p className="text-sm text-white/70">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-emerald-300 mr-2" />
                <span className="text-3xl font-bold text-white">
                  <AnimatedCounter end={stats.totalEvents || 8} suffix="+" />
                </span>
              </div>
              <p className="text-sm text-white/70">Exam Events</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-amber-300 mr-2" />
                <span className="text-3xl font-bold text-white">
                  <AnimatedCounter end={stats.totalSubscribers || 100} suffix="+" />
                </span>
              </div>
              <p className="text-sm text-white/70">Subscribers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
