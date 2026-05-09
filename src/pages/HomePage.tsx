import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import DeadlineAlert from '../components/DeadlineAlert';
import ExamCategories from '../components/ExamCategories';
import SmartFilters from '../components/SmartFilters';
import TrendingSection from '../components/TrendingSection';
import ExamCalendar from '../components/ExamCalendar';
import NotificationCenter from '../components/NotificationCenter';
import { Job } from '../App';

interface HomePageProps {
  darkMode: boolean;
  jobs: Job[];
  loading: boolean;
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  bookmarks: string[];
  toggleBookmark: (job: Job) => void;
}

export default function HomePage({
  darkMode, jobs, loading, filters, setFilters,
  searchQuery, setSearchQuery, bookmarks, toggleBookmark
}: HomePageProps) {
  const handleSearch = () => {
    const el = document.getElementById('trending-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <DeadlineAlert darkMode={darkMode} />
      <HeroBanner
        darkMode={darkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <ExamCategories darkMode={darkMode} setFilters={setFilters} setSearchQuery={setSearchQuery} />
      <SmartFilters darkMode={darkMode} filters={filters} setFilters={setFilters} />
      <div id="trending-section">
        <TrendingSection
          darkMode={darkMode}
          jobs={jobs}
          loading={loading}
          setSearchQuery={setSearchQuery}
          setFilters={setFilters}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
        />
      </div>
      <ExamCalendar darkMode={darkMode} />
      <NotificationCenter darkMode={darkMode} />
    </>
  );
}
