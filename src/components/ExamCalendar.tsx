import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ExamCalendarProps {
  darkMode: boolean;
}

export default function ExamCalendar({ darkMode }: ExamCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [examEvents, setExamEvents] = useState<Record<string, any>>({});
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://sarkari-exam-backend.onrender.com/api/events")
      .then(r => r.json())
      .then(data => {
        const map: Record<string, any> = {};
        data.forEach((e: any) => {
          if (e.date) {
            const dateStr = e.date.split('T')[0];
            map[dateStr] = e;
          }
        });
        setExamEvents(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) days.push(day);
    return days;
  };

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (dir === 'prev' ? -1 : 1));
      return d;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  return (
    <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Exam Calendar</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Stay updated with important exam dates</p>
        </div>

        <div className={`rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button onClick={() => navigateMonth('prev')} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {monthNames[month]} {year}
            </h3>
            <button onClick={() => navigateMonth('next')} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Grid */}
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className={`p-2 text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d}</div>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({length: 35}).map((_,i) => (
                  <div key={i} className={`h-16 rounded-lg animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) return <div key={index} className="p-2 h-16" />;
                  const dateString = formatDate(year, month, day);
                  const event = examEvents[dateString];
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                  return (
                    <div key={day}
                      onClick={() => event && setSelectedEvent(event)}
                      className={`p-2 h-16 border rounded-lg transition-colors ${
                        event ? 'cursor-pointer' : ''
                      } ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} ${
                        isToday ? 'ring-2 ring-sky-500' : ''
                      }`}>
                      <div className={`text-sm font-medium ${isToday ? 'text-sky-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>{day}</div>
                      {event && (
                        <div className={`text-xs mt-1 p-0.5 rounded text-white ${event.color} truncate`}>
                          {event.title.length > 10 ? event.title.substring(0, 10) + '…' : event.title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className={`px-6 pb-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { color: 'bg-blue-500', label: 'Exam Dates' },
                { color: 'bg-green-500', label: 'Results' },
                { color: 'bg-yellow-500', label: 'Admit Cards' },
                { color: 'bg-red-500', label: 'Deadlines' },
              ].map(l => (
                <div key={l.label} className="flex items-center">
                  <div className={`w-3 h-3 ${l.color} rounded mr-2`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
            <div className={`max-w-md w-full mx-4 rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${selectedEvent.color}`}>
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <button onClick={() => setSelectedEvent(null)} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.title}</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📅 {new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Type: <span className="capitalize font-medium">{selectedEvent.type}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}