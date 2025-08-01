'use client';

import { useState } from 'react';
import { UserType } from '@/types';
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
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-5 bg-gradient-to-r from-[#7565D9] to-[#5040C2] rounded-full px-3 py-2 w-fit mx-auto">
              <Sparkles className="w-4 h-4 text-white" />
              <p className="text-white text-sm">Intervue Poll</p>
            </div>
            <h1 className="text-4xl text-[#000000] mb-2">
              Welcome to the <span className="font-bold">Live Polling System</span>
            </h1>
            
          
          <p className="text-[#00000080] max-w-xl mx-auto">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className=" bg-[#F2F2F2]">
          {!selectedRole ? (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setSelectedRole('teacher')}
                className="w-full flex flex-col gap-2 items-center justify-center space-x-3 p-6 border-2 border-[#00000060] hover:border-[#7765DA] rounded-lg hover:bg-[#7765DA]/10 transition-colors"
              >
                <div className="text-2xl font-semibold text-[#000000]">
                  I'm a Teacher
                </div>
                <div className="text-sm text-[#00000080]">
                  Submit answers and view live poll results in real-time.
                </div>
              </button>
              
              <button
                onClick={() => setSelectedRole('student')}
                className="w-full flex flex-col gap-2 items-center justify-center space-x-3 p-6 border-2 border-[#00000060] hover:border-[#7765DA] rounded-lg hover:bg-[#7765DA]/10 transition-colors"
              >
                <div className="text-2xl font-semibold text-[#000000]">
                  I'm a Student
                </div>
                <div className="text-sm text-[#00000080]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setName('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border-1 border-[#00000080] rounded-md hover:bg-[#7765DA]/20 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-[#7765DA] rounded-md hover:bg-[#7765DA]/80 transition-colors"
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