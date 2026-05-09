import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-50 p-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-fade-in"
      title="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
