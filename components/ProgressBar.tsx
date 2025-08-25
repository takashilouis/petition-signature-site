'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  goal: number;
  className?: string;
}

export function ProgressBar({ current, goal, className = '' }: ProgressBarProps) {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const percentage = Math.min((current / goal) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCurrent(current);
    }, 100);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          {animatedCurrent.toLocaleString()} signatures
        </span>
        <span className="text-sm font-medium text-gray-600">
          Goal: {goal.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={`${current} of ${goal} signatures collected`}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500 text-center">
        {percentage.toFixed(1)}% of goal reached
      </div>
    </div>
  );
}