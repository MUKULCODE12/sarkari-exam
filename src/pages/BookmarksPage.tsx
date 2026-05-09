import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { Job } from '../App';
import JobCard from '../components/JobCard';

interface BookmarksPageProps {
  darkMode: boolean;
  bookmarks: string[];
  bookmarkedJobs: Job[];
  toggleBookmark: (job: Job) => void;
}

export default function BookmarksPage({ darkMode, bookmarks, bookmarkedJobs, toggleBookmark }: BookmarksPageProps) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className={`h-8 w-8 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bookmarked Jobs</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{bookmarkedJobs.length} saved jobs</p>
          </div>
        </div>

        {bookmarkedJobs.length === 0 ? (
          <div className={`text-center py-16 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Bookmark className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No bookmarks yet</p>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Save jobs to access them quickly later</p>
            <button onClick={() => navigate('/jobs')} className="px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors">
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedJobs.map(job => (
              <JobCard key={job._id} job={job} darkMode={darkMode} isBookmarked={true} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
