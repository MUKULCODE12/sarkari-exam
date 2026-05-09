import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Youtube, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Footer({ darkMode, setSearchQuery }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleQuickLink = (term: string) => {
    if (setSearchQuery) setSearchQuery(term);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-800'} border-t border-gray-700`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">ExamPortal</h3>
            <p className="text-gray-300 mb-6">Your trusted companion for government exam preparation. Get latest updates, results, and notifications all in one place.</p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Youtube, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors"><Icon className="h-5 w-5" /></a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Jobs', to: '/jobs' },
                { label: 'Bookmarks', to: '/bookmarks' },
                { label: 'Admin Panel', to: '/admin' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-300 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
              {['Admit Cards', 'Results', 'Syllabus', 'Answer Keys', 'Cut-off Marks'].map(link => (
                <li key={link}>
                  <button onClick={() => handleQuickLink(link)} className="text-gray-300 hover:text-white transition-colors">{link}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Exam Categories</h4>
            <ul className="space-y-2">
              {['SSC Exams', 'Railway Jobs', 'UPSC Exams', 'Defence Jobs', 'Banking Jobs', 'Police Jobs', 'State PSC', 'Engineering Exams'].map(cat => (
                <li key={cat}>
                  <button onClick={() => handleQuickLink(cat.split(' ')[0])} className="text-gray-300 hover:text-white transition-colors">{cat}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact & Support</h4>
            <div className="space-y-3">
              <a href="mailto:support@examportal.com" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5 mr-3 text-gray-400" /> support@examportal.com
              </a>
              <a href="tel:+919876543210" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Phone className="h-5 w-5 mr-3 text-gray-400" /> +91 9876543210
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5 mr-3 text-gray-400" /> WhatsApp Support
              </a>
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-2">Join Our Community</h5>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">📱 Telegram Channel</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">📺 YouTube Channel</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ExamPortal. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'About Us', 'Contact Us'].map(link => (
                <a key={link} href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}