import React from 'react';
import { Bookmark, BookmarkCheck, Eye, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../App';

interface JobCardProps {
  job: Job;
  darkMode: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (job: Job) => void;
}

export default function JobCard({ job, darkMode, isBookmarked, onToggleBookmark }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`group p-6 rounded-xl transition-all duration-300 hover:shadow-xl cursor-pointer border ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
          : 'bg-white border-gray-200 hover:border-sky-200'
      }`}
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {job.title}
            </h3>
            {job.isTrending && (
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0">
                🔥 Trending
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Clock className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last Date: {job.lastDate}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {job.category && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                darkMode ? 'bg-sky-900/40 text-sky-300 border border-sky-700/50' : 'bg-sky-50 text-sky-700 border border-sky-200'
              }`}>
                {job.category}
              </span>
            )}
            {job.qualification && (
              <span className={`text-xs px-3 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {job.qualification}
              </span>
            )}
            {job.state && (
              <span className={`text-xs px-3 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                📍 {job.state}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 ml-4 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(job);
            }}
            className={`p-2 rounded-lg transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-500'
                : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
          >
            {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>

          {job.applyLink && job.applyLink !== '#' && (
            <a
              href={job.applyLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-700 text-sky-400' : 'hover:bg-sky-50 text-sky-600'
              }`}
              title="Apply Now"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
