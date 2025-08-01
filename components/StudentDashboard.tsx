'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Poll, ChatMessage } from '@/types';
import { ArrowLeft, Clock, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import PollResults from './PollResults';
import ChatModal from './ChatModal';

interface StudentDashboardProps {
  studentName: string;
  onBack: () => void;
}

export default function StudentDashboard({ studentName, onBack }: StudentDashboardProps) {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    if (!isConnected) return;

    // Join as student
    emit('student-join', studentName);

    // Listen for events
    on('student-joined', (data) => {
      setCurrentPoll(data.currentPoll);
    });

    on('poll-created', (poll) => {
      setCurrentPoll(poll);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setTimeLeft(poll.timeLimit);
    });

    on('poll-update', (poll) => {
      setCurrentPoll(poll);
    });

    on('poll-ended', (data) => {
      setCurrentPoll(data.poll);
      setTimeLeft(null);
    });

    on('answer-submitted', (data) => {
      if (data.studentName === studentName) {
        setHasAnswered(true);
      }
    });

    on('chat-history', (messages) => {
      setChatMessages(messages);
    });

    on('new-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    on('removed-by-teacher', () => {
      setIsRemoved(true);
    });

    on('error', (errorMessage) => {
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      off('student-joined');
      off('poll-created');
      off('poll-update');
      off('poll-ended');
      off('answer-submitted');
      off('chat-history');
      off('new-message');
      off('removed-by-teacher');
      off('error');
    };
  }, [isConnected, emit, on, off, studentName]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev > 0) {
          return prev - 1;
        }
        return null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer && currentPoll?.isActive && !hasAnswered) {
      emit('submit-answer', selectedAnswer);
    }
  };

  const handleSendMessage = (content: string) => {
    emit('send-message', { content });
  };

  if (isRemoved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You have been removed
          </h1>
          <p className="text-gray-600 mb-6">
            The teacher has removed you from the session.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome, {studentName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <button
                onClick={() => setShowChat(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPoll ? (
          <div className="space-y-6">
            {/* Current Poll */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Current Question
                </h2>
                {timeLeft !== null && currentPoll.isActive && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className={`font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
                      {timeLeft}s remaining
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    {currentPoll.question}
                  </h3>
                  
                  {currentPoll.isActive && !hasAnswered ? (
                    <div className="space-y-3">
                      {currentPoll.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(option)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            selectedAnswer === option
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center justify-center">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-gray-700">{option}</span>
                          </div>
                        </button>
                      ))}
                      
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer}
                        className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Submit Answer
                      </button>
                    </div>
                  ) : hasAnswered ? (
                    <div className="text-center py-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">Answer submitted!</p>
                      <p className="text-sm text-gray-500 mt-1">
                        You selected: {selectedAnswer}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>Poll has ended. View results below.</p>
                    </div>
                  )}
                </div>

                {/* Results */}
                {(!currentPoll.isActive || hasAnswered) && (
                  <PollResults poll={currentPoll} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Waiting for Poll
              </h2>
              <p className="text-gray-600">
                The teacher will start a poll soon. You'll be able to participate once it begins.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && (
        <ChatModal
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setShowChat(false)}
          currentUser={studentName}
          userType="student"
        />
      )}
    </div>
  );
} 