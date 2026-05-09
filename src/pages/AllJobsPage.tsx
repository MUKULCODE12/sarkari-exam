import React, { useState, useEffect } from 'react';
import { Search, Filter, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import JobCard from '../components/JobCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Job } from '../App';

interface AllJobsPageProps {
  darkMode: boolean;
  bookmarks: string[];
  toggleBookmark: (job: Job) => void;
}

const ITEMS_PER_PAGE = 8;

export default function AllJobsPage({ darkMode, bookmarks, toggleBookmark }: AllJobsPageProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [qualification, setQualification] = useState('');
  const [state, setState] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (qualification) params.set('qualification', qualification);
    if (state) params.set('state', state);
    if (jobType) params.set('type', jobType);

    const query = params.toString();
    fetch(`https://sarkari-exam-backend.onrender.com/api/jobs${query ? '?' + query : ''}`)
      .then(r => r.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
        setPage(1);
      })
      .catch(() => setLoading(false));
  }, [search, category, qualification, state, jobType]);

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'newest') return 0; // already sorted by API
    if (sortBy === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = sortedJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Government Jobs
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse and filter {jobs.length} active government job listings
          </p>
        </div>

        {/* Filters Bar */}
        <div className={`p-4 rounded-xl mb-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="">All Categories</option>
              {['SSC', 'Railway', 'UPSC', 'Defence', 'Banking', 'Police', 'State PSC', 'Engineering', 'Teaching', 'Medical', 'Board', 'University', 'ITI', 'Yojana'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="">All Types</option>
              {['Latest Job', 'Result', 'Admit Card', 'Answer Key', 'Admission', 'Yojana'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Qualification Filter */}
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="">All Qualifications</option>
              {['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma/BTech', 'Graduate + BEd'].map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="">All States</option>
              {['All India', 'Delhi', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Madhya Pradesh', 'Punjab', 'Assam', 'Gujarat', 'Maharashtra'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="trending">Trending First</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-sky-600 text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-sky-600 text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <LoadingSkeleton type="card" count={4} darkMode={darkMode} />
        ) : paginatedJobs.length === 0 ? (
          <div className={`text-center py-16 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <Filter className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No jobs found matching your criteria
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
            {paginatedJobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                darkMode={darkMode}
                isBookmarked={bookmarks.includes(job._id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                page === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                page === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
