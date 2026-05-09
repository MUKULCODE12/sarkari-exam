import React, { useState } from 'react';
import { Building2, Train, MapPin, Shield, Banknote, ShieldCheck, GraduationCap, Book, ChevronRight } from 'lucide-react';

interface ExamCategoriesProps {
  darkMode: boolean;
  setFilters: (filters: any) => void;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const categories = [
  {
    name: 'SSC',
    icon: Building2,
    color: 'bg-blue-500',
    description: 'Staff Selection Commission',
    exams: ['SSC CGL', 'SSC CHSL', 'SSC JE', 'SSC MTS'],
    upcoming: 12
  },
  {
    name: 'Railway',
    icon: Train,
    color: 'bg-green-500',
    description: 'Railway Recruitment Board',
    exams: ['RRB NTPC', 'RRB JE', 'RRB ALP', 'RRB Group D'],
    upcoming: 8
  },
  {
    name: 'UPSC',
    icon: MapPin,
    color: 'bg-purple-500',
    description: 'Union Public Service Commission',
    exams: ['UPSC Prelims', 'UPSC Mains', 'UPSC Interview', 'CAPF'],
    upcoming: 6
  },
  {
    name: 'Defence',
    icon: Shield,
    color: 'bg-red-500',
    description: 'Defence Services',
    exams: ['NDA', 'CDS', 'AFCAT', 'Indian Navy'],
    upcoming: 9
  },
  {
    name: 'Banking',
    icon: Banknote,
    color: 'bg-yellow-500',
    description: 'Banking & Financial Services',
    exams: ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'RBI Grade B'],
    upcoming: 15
  },
  {
    name: 'Police',
    icon: ShieldCheck,
    color: 'bg-indigo-500',
    description: 'Police & Security Forces',
    exams: ['Delhi Police', 'UP Police', 'CRPF', 'BSF'],
    upcoming: 11
  },
  {
    name: 'State PSC',
    icon: Building2,
    color: 'bg-pink-500',
    description: 'State Public Service Commission',
    exams: ['BPSC', 'UPPSC', 'MPSC', 'WBPSC'],
    upcoming: 18
  },
  {
    name: 'Engineering',
    icon: GraduationCap,
    color: 'bg-teal-500',
    description: 'IIT/JEE & Engineering',
    exams: ['JEE Main', 'JEE Advanced', 'GATE', 'NEET'],
    upcoming: 7
  }
];

export default function ExamCategories({ darkMode, setFilters, setSearchQuery }: ExamCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCategory);
    setFilters((prev: any) => {
      const updated = { ...prev };
      if (newCategory) {
        updated.category = newCategory;
      } else {
        delete updated.category;
      }
      return updated;
    });
  };

  return (
    <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Exam Categories
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose your exam category to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className={`group cursor-pointer rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                } shadow-lg hover:shadow-xl`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.upcoming} upcoming
                  </span>
                </div>

                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                    View Details
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                    darkMode ? 'text-sky-400' : 'text-sky-600'
                  }`} />
                </div>

                {/* Expanded content */}
                {selectedCategory === category.name && (
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Popular Exams:
                    </h4>
                    <div className="space-y-1">
                      {category.exams.map((exam) => (
                        <div
                          key={exam}
                          onClick={() => {
                            setSearchQuery(exam);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`text-sm px-2 py-1 rounded cursor-pointer hover:underline ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {exam}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <button 
                        onClick={() => {
                          setSearchQuery("Upcoming");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`py-2 px-3 rounded-md font-medium transition-colors ${
                        darkMode 
                          ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                          : 'bg-sky-100 hover:bg-sky-200 text-sky-700'
                      }`}>
                        Upcoming Exams
                      </button>
                      <button 
                        onClick={() => {
                          setSearchQuery("Result");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`py-2 px-3 rounded-md font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}>
                        Recent Results
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}