export interface Poll {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  createdAt: Date;
  answers: Map<string, string>;
  isActive: boolean;
  results: Record<string, number>;
}

export interface Student {
  name: string;
  socketId: string;
  hasAnswered: boolean;
  currentAnswer: string | null;
}

export interface Teacher {
  name: string;
  socketId: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderType: 'student' | 'teacher';
  content: string;
  timestamp: Date;
}

export interface PollData {
  question: string;
  options: string[];
  timeLimit: number;
}

export interface PollResults {
  poll: Poll;
  results: Record<string, number>;
}

export interface AnswerSubmission {
  studentName: string;
  answer: string;
  pollResults: Record<string, number>;
}

export type UserType = 'teacher' | 'student';

export interface SocketEvents {
  // Connection events
  'teacher-join': (teacherName: string) => void;
  'student-join': (studentName: string) => void;
  
  // Poll events
  'create-poll': (pollData: PollData) => void;
  'submit-answer': (answer: string) => void;
  'end-poll': () => void;
  
  // Chat events
  'send-message': (messageData: { content: string }) => void;
  
  // Management events
  'remove-student': (studentSocketId: string) => void;
  
  // Response events
  'teacher-joined': (data: { teacherName: string; currentPoll: Poll | null }) => void;
  'student-joined': (data: { studentName: string; currentPoll: Poll | null }) => void;
  'poll-created': (poll: Poll) => void;
  'poll-update': (poll: Poll) => void;
  'poll-ended': (data: PollResults) => void;
  'answer-submitted': (data: AnswerSubmission) => void;
  'student-list-update': (students: Student[]) => void;
  'student-removed': (studentName: string) => void;
  'removed-by-teacher': () => void;
  'chat-history': (messages: ChatMessage[]) => void;
  'new-message': (message: ChatMessage) => void;
  'error': (message: string) => void;
} 