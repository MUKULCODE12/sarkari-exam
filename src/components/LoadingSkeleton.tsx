import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'calendar';
  count?: number;
  darkMode?: boolean;
}

function SkeletonPulse({ className, darkMode }: { className: string; darkMode?: boolean }) {
  return (
    <div className={`animate-pulse rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${className}`} />
  );
}

function CardSkeleton({ darkMode }: { darkMode?: boolean }) {
  return (
    <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <SkeletonPulse className="h-5 w-3/4 mb-3" darkMode={darkMode} />
          <SkeletonPulse className="h-4 w-1/2 mb-4" darkMode={darkMode} />
          <div className="flex gap-2">
            <SkeletonPulse className="h-6 w-20" darkMode={darkMode} />
            <SkeletonPulse className="h-6 w-16" darkMode={darkMode} />
          </div>
        </div>
        <SkeletonPulse className="h-8 w-8 rounded" darkMode={darkMode} />
      </div>
    </div>
  );
}

function ListSkeleton({ darkMode }: { darkMode?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <SkeletonPulse className="h-10 w-10 rounded-full" darkMode={darkMode} />
      <div className="flex-1">
        <SkeletonPulse className="h-4 w-3/4 mb-2" darkMode={darkMode} />
        <SkeletonPulse className="h-3 w-1/2" darkMode={darkMode} />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 3, darkMode = false }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === 'list') {
    return <div className="space-y-2">{items.map((_, i) => <ListSkeleton key={i} darkMode={darkMode} />)}</div>;
  }

  return <div className="space-y-4">{items.map((_, i) => <CardSkeleton key={i} darkMode={darkMode} />)}</div>;
}
