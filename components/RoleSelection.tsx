'use client';

import { useState } from 'react';
import { UserType } from '../types';
import { Sparkles } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: UserType, name: string) => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && name.trim()) {
      onRoleSelect(selectedRole, name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-5 bg-gradient-to-r from-[#7565D9] to-[#5040C2] rounded-full px-3 py-2 w-fit mx-auto">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <p className="text-white text-xs sm:text-sm">Intervue Poll</p>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#000000] mb-2 sm:mb-3">
              Welcome to the <span className="font-bold">Live Polling System</span>
            </h1>
            
          
          <p className="text-sm sm:text-base text-[#00000080] max-w-xl mx-auto px-4 sm:px-0">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className="bg-[#F2F2F2]">
          {!selectedRole ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
              <button
                onClick={() => setSelectedRole('teacher')}
                className="w-full sm:w-1/2 flex flex-col gap-2 items-center justify-center p-4 sm:p-6 border-2 border-[#00000060] hover:border-[#7765DA] rounded-lg hover:bg-[#7765DA]/10 transition-colors"
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#000000] text-center">
                  I&apos;m a Teacher
                </div>
                <div className="text-xs sm:text-sm text-[#00000080] text-center">
                  Create polls and manage student responses in real-time.
                </div>
              </button>
              
              <button
                onClick={() => setSelectedRole('student')}
                className="w-full sm:w-1/2 flex flex-col gap-2 items-center justify-center p-4 sm:p-6 border-2 border-[#00000060] hover:border-[#7765DA] rounded-lg hover:bg-[#7765DA]/10 transition-colors"
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#000000] text-center">
                  I&apos;m a Student
                </div>
                <div className="text-xs sm:text-sm text-[#00000080] text-center">
                  Submit answers and view live poll results in real-time.
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-md mx-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedRole === 'teacher' ? 'Teacher Name' : 'Student Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter your ${selectedRole === 'teacher' ? 'teacher' : 'student'} name`}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F0DCE] focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setName('');
                  }}
                  className="flex-1 px-4 py-2 sm:py-3 text-gray-700 border-1 border-[#00000080] rounded-md hover:bg-[#7765DA]/20 transition-colors text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 sm:py-3 text-white bg-[#7765DA] rounded-md hover:bg-[#7765DA]/80 transition-colors text-sm sm:text-base"
                >
                  Join
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 











