'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { Poll, Student, ChatMessage } from '../types';
import { ArrowLeft, Plus, Users, MessageCircle, BarChart3 } from 'lucide-react';
import CreatePollModal from './CreatePollModal';
import PollResults from './PollResults';
import StudentList from './StudentList';
import ChatModal from './ChatModal';

interface TeacherDashboardProps {
  teacherName: string;
  onBack: () => void;
}

export default function TeacherDashboard({ teacherName, onBack }: TeacherDashboardProps) {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) return;

    // Join as teacher
    emit('teacher-join', teacherName);

    // Listen for events
    on('teacher-joined', (data) => {
      setCurrentPoll(data.currentPoll);
    });

    on('poll-created', (poll) => {
      setCurrentPoll(poll);
      setShowCreatePoll(false);
    });

    on('poll-update', (poll) => {
      setCurrentPoll(poll);
    });

    on('poll-ended', (data) => {
      setCurrentPoll(data.poll);
    });

    on('student-list-update', (studentList) => {
      setStudents(studentList);
    });

    on('chat-history', (messages) => {
      setChatMessages(messages);
    });

    on('new-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    on('error', (errorMessage) => {
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      off('teacher-joined');
      off('poll-created');
      off('poll-update');
      off('poll-ended');
      off('student-list-update');
      off('chat-history');
      off('new-message');
      off('error');
    };
  }, [isConnected, emit, on, off, teacherName]);

  const handleCreatePoll = (pollData: { question: string; options: string[]; timeLimit: number }) => {
    emit('create-poll', pollData);
  };

  const handleEndPoll = () => {
    emit('end-poll');
  };

  const handleRemoveStudent = (studentSocketId: string) => {
    emit('remove-student', studentSocketId);
  };

  const handleSendMessage = (content: string) => {
    emit('send-message', { content });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Teacher Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome, {teacherName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poll Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Current Poll
                </h2>
                <button
                  onClick={() => setShowCreatePoll(true)}
                  disabled={currentPoll?.isActive}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#4F0DCE] text-white rounded-md hover:bg-[#7765DA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Poll</span>
                </button>
              </div>

              {currentPoll ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {currentPoll.question}
                    </h3>
                    <div className="space-y-2">
                      {currentPoll.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-4 h-4 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center justify-center">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-700">{option}</span>
                        </div>
                      ))}
                    </div>
                    {currentPoll.isActive && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Time limit: {currentPoll.timeLimit} seconds
                        </span>
                        <button
                          onClick={handleEndPoll}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          End Poll
                        </button>
                      </div>
                    )}
                  </div>

                  {!currentPoll.isActive && (
                    <PollResults poll={currentPoll} />
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active poll. Create a new poll to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Students ({students.length})</span>
                </h3>
              </div>
              <StudentList 
                students={students} 
                onRemoveStudent={handleRemoveStudent}
                currentPoll={currentPoll}
              />
            </div>

            {/* Chat Button */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={() => setShowChat(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreatePoll && (
        <CreatePollModal
          onClose={() => setShowCreatePoll(false)}
          onCreatePoll={handleCreatePoll}
          canCreate={!currentPoll?.isActive}
        />
      )}

      {showChat && (
        <ChatModal
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setShowChat(false)}
          currentUser={teacherName}
          userType="teacher"
        />
      )}
    </div>
  );
} 