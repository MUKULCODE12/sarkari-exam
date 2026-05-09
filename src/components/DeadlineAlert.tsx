import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ExternalLink, X } from 'lucide-react';

interface DeadlineJob {
  _id: string;
  title: string;
  lastDate: string;
  applyLink: string;
  daysLeft: number;
}

interface DeadlineAlertProps {
  darkMode: boolean;
}

export default function DeadlineAlert({ darkMode }: DeadlineAlertProps) {
  const [deadlines, setDeadlines] = useState<DeadlineJob[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed from localStorage
    const stored = localStorage.getItem('dismissedDeadlines');
    if (stored) {
      try { setDismissed(JSON.parse(stored)); } catch {}
    }

    fetch('http://localhost:5000/api/jobs/deadlines')
      .then(r => r.json())
      .then(data => setDeadlines(data))
      .catch(() => {});
  }, []);

  const dismiss = (id: string) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('dismissedDeadlines', JSON.stringify(updated));
  };

  const visible = deadlines.filter(d => !dismissed.includes(d._id));
  if (visible.length === 0) return null;

  const getUrgencyStyles = (daysLeft: number) => {
    if (daysLeft <= 1) return {
      bg: 'bg-gradient-to-r from-red-600 to-red-500',
      text: 'text-white',
      badge: '🔴 LAST DAY',
      pulse: true
    };
    if (daysLeft <= 3) return {
      bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      text: 'text-white',
      badge: '🟠 URGENT',
      pulse: false
    };
    return {
      bg: 'bg-gradient-to-r from-yellow-400 to-amber-400',
      text: 'text-gray-900',
      badge: '🟡 REMINDER',
      pulse: false
    };
  };

  return (
    <div className="space-y-0">
      {visible.slice(0, 3).map((deadline) => {
        const style = getUrgencyStyles(deadline.daysLeft);
        return (
          <div
            key={deadline._id}
            className={`${style.bg} ${style.text} ${style.pulse ? 'animate-urgent-pulse' : ''}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm shrink-0">{style.badge}</span>
                  <span className="text-sm truncate">
                    <strong>{deadline.title}</strong> — {deadline.daysLeft <= 1 ? 'Today is the last day!' : `${deadline.daysLeft} days left to apply!`}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-bold">
                      {deadline.daysLeft}d remaining
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {deadline.applyLink && deadline.applyLink !== '#' && (
                    <a
                      href={deadline.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        deadline.daysLeft <= 1
                          ? 'bg-white text-red-600 hover:bg-red-50'
                          : deadline.daysLeft <= 3
                          ? 'bg-white text-orange-600 hover:bg-orange-50'
                          : 'bg-white text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      Apply Now <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    onClick={() => dismiss(deadline._id)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
