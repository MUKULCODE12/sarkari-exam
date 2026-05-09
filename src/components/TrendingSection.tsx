import React from "react";
import { TrendingUp, Star } from "lucide-react";
import { Job } from "../App";
import JobCard from "./JobCard";
import LoadingSkeleton from "./LoadingSkeleton";

interface TrendingSectionProps {
  darkMode: boolean;
  jobs: Job[];
  loading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  bookmarks: string[];
  toggleBookmark: (job: Job) => void;
}

export default function TrendingSection({
  darkMode, jobs, loading, setSearchQuery, setFilters, bookmarks, toggleBookmark
}: TrendingSectionProps) {
  const quickLinks = ["Latest Results", "Admit Cards", "Answer Keys", "Syllabi", "Previous Papers", "Cut-off Marks"];

  return (
    <section className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Jobs */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <TrendingUp className={`h-6 w-6 mr-3 ${darkMode ? "text-sky-400" : "text-sky-600"}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Trending Now</h2>
            </div>

            {loading ? (
              <LoadingSkeleton type="card" count={3} darkMode={darkMode} />
            ) : jobs.length === 0 ? (
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No trending jobs available</p>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 6).map(job => (
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
          </div>

          {/* Sidebar */}
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Quick Links</h2>
            <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <div className="space-y-3">
                {quickLinks.map((link, i) => (
                  <button key={i} onClick={() => { setSearchQuery(link); }}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                      darkMode ? "hover:bg-gray-700 text-gray-300 hover:text-white" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    }`}>
                    <span className="font-medium">{link}</span>
                    <Star className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Most Searched */}
            <div className={`mt-6 rounded-xl p-6 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Most Searched</h3>
              <div className="space-y-2">
                {["SSC CGL Result 2026", "IBPS PO Admit Card", "Railway Group D", "UPSC IAS Syllabus", "SBI Clerk Form"].map((s, i) => (
                  <button key={i} onClick={() => setSearchQuery(s)}
                    className={`w-full text-left text-sm p-2 rounded cursor-pointer hover:underline ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                    }`}>
                    {i + 1}. {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
