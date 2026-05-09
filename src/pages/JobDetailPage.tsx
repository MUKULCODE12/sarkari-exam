import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Briefcase, GraduationCap, User, 
  ExternalLink, Bookmark, Share2, ArrowLeft, 
  FileText, CheckCircle, Info, Download, MessageCircle, Send
} from 'lucide-react';
import { Job } from '../App';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';

interface JobDetailPageProps {
  darkMode: boolean;
  bookmarks: string[];
  toggleBookmark: (job: Job) => void;
}

export default function JobDetailPage({ darkMode, bookmarks, toggleBookmark }: JobDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then(r => r.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  if (loading) return <div className="max-w-4xl mx-auto p-4"><LoadingSkeleton type="card" count={1} darkMode={darkMode} /></div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  const isBookmarked = bookmarks.includes(job._id);

  const sectionCls = `p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`;
  const labelCls = `text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;
  const valueCls = `text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`;

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/jobs" className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
          <div className="flex gap-2">
            <button onClick={handleShare} className={`p-2 rounded-lg border ${darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-white'} transition-colors`}>
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => toggleBookmark(job)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all ${
                isBookmarked 
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20' 
                  : `${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-white'}`
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className={sectionCls}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${darkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-100 text-sky-700'}`}>
                  {job.type || 'Latest Job'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                  {job.category}
                </span>
              </div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {job.title}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className={labelCls}>Last Date</p>
                  <div className="flex items-center gap-1.5 text-red-500 font-bold">
                    <Calendar className="h-4 w-4" /> {job.lastDate}
                  </div>
                </div>
                <div>
                  <p className={labelCls}>State</p>
                  <div className={`flex items-center gap-1.5 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin className="h-4 w-4" /> {job.state || 'All India'}
                  </div>
                </div>
                <div>
                  <p className={labelCls}>Qualification</p>
                  <div className={`flex items-center gap-1.5 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <GraduationCap className="h-4 w-4" /> {job.qualification || 'N/A'}
                  </div>
                </div>
                <div>
                  <p className={labelCls}>Posts</p>
                  <div className={`flex items-center gap-1.5 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <User className="h-4 w-4" /> {job.postCount || 'Check Notif'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex flex-wrap gap-4`}>
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/20"
            >
              Apply Online <ExternalLink className="h-4 w-4" />
            </a>
            {job.sourceUrl && (
              <a 
                href={job.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 border-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Official Website <Info className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Professional Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`md:col-span-2 ${sectionCls}`}>
            <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FileText className="h-5 w-5 text-sky-500" /> Selection Process
            </h2>
            <div className={`prose prose-sm max-w-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>{job.selectionProcess || 'The selection process typically includes a written examination followed by an interview or document verification. Please refer to the official notification for detailed stage-wise information.'}</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Written Examination</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Document Verification</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Final Merit List</li>
              </ul>
            </div>
          </div>

          <div className={sectionCls}>
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Download className="h-5 w-5 text-amber-500" /> Quick Links
            </h2>
            <div className="space-y-3">
              <button className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-650 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}>
                Download Notification <Download className="h-4 w-4 text-gray-400" />
              </button>
              <button className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-650 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}>
                Download Syllabus <Download className="h-4 w-4 text-gray-400" />
              </button>
              <button className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-650 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}>
                Previous Papers <Download className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Discussion Section */}
        <div className={sectionCls}>
          <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <MessageCircle className="h-5 w-5 text-emerald-500" /> Discussion Community
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold shrink-0">Y</div>
              <div className="flex-1">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ask a question or share an update about this exam..."
                  className={`w-full p-4 rounded-xl border text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all">
                    Post Comment <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex gap-4 mb-6 opacity-60">
                <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold shrink-0">A</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Arjun Singh</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Has anyone been able to download the syllabus PDF? The link on official site is showing error.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 opacity-60">
                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">EP</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>ExamPortal Support</span>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] rounded uppercase font-black">Official</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Hi Arjun, we have uploaded the backup copy in our "Quick Links" section above. You can download it directly from there.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
