'use client';

import { Student, Poll } from '@/types';
import { Trash2, CheckCircle, Clock } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onRemoveStudent: (studentSocketId: string) => void;
  currentPoll: Poll | null;
}

export default function StudentList({ students, onRemoveStudent, currentPoll }: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No students joined yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {students.map((student) => {
        const hasAnswered = currentPoll?.isActive ? student.hasAnswered : false;
        const isCurrentPoll = currentPoll?.isActive;

        return (
          <div
            key={student.socketId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {student.name}
                </span>
                {isCurrentPoll && (
                  <div className="flex items-center space-x-1">
                    {hasAnswered ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {hasAnswered ? 'Answered' : 'Waiting'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onRemoveStudent(student.socketId)}
              className="p-1 text-red-400 hover:text-red-600 transition-colors"
              title="Remove student"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
} 