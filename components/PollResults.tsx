'use client';

import { Poll } from '../types';
import { BarChart3, Users } from 'lucide-react';

interface PollResultsProps {
  poll: Poll;
}

export default function PollResults({ poll }: PollResultsProps) {
  const totalVotes = Object.values(poll.results).reduce((sum, count) => sum + count, 0);
  const maxVotes = Math.max(...Object.values(poll.results), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
        <BarChart3 className="w-5 h-5" />
        <span>Results</span>
      </div>

      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const votes = poll.results[option] || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const barWidth = totalVotes > 0 ? (votes / maxVotes) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 font-medium">{option}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">{votes} votes</span>
                  <span className="text-gray-500">({percentage}%)</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Total votes: {totalVotes}</span>
        </div>
        <div className="text-sm text-gray-500">
          {poll.isActive ? 'Poll in progress' : 'Poll ended'}
        </div>
      </div>
    </div>
  );
} 