const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
const polls = new Map();
const students = new Map();
const teachers = new Map();
const chatMessages = [];

// Poll state management
let currentPoll = null;
let pollTimer = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher joins
  socket.on('teacher-join', (teacherName) => {
    teachers.set(socket.id, { name: teacherName, socketId: socket.id });
    socket.join('teachers');
    socket.emit('teacher-joined', { teacherName, currentPoll });
    
    // Send current state
    if (currentPoll) {
      socket.emit('poll-update', currentPoll);
    }
    
    // Send chat messages
    socket.emit('chat-history', chatMessages);
  });

  // Student joins
  socket.on('student-join', (studentName) => {
    const studentId = socket.id;
    students.set(studentId, { 
      name: studentName, 
      socketId: studentId,
      hasAnswered: false,
      currentAnswer: null
    });
    socket.join('students');
    socket.emit('student-joined', { studentName, currentPoll });
    
    // Send current state
    if (currentPoll) {
      socket.emit('poll-update', currentPoll);
    }
    
    // Send chat messages
    socket.emit('chat-history', chatMessages);
    
    // Notify teacher
    io.to('teachers').emit('student-list-update', Array.from(students.values()));
  });

  // Teacher creates a new poll
  socket.on('create-poll', (pollData) => {
    if (currentPoll && !canAskNewQuestion()) {
      socket.emit('error', 'Cannot create new poll: previous poll is still active or not all students have answered');
      return;
    }

    const poll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date(),
      answers: new Map(),
      isActive: true,
      results: {}
    };

    currentPoll = poll;
    polls.set(poll.id, poll);

    // Reset student answers
    students.forEach(student => {
      student.hasAnswered = false;
      student.currentAnswer = null;
    });

    // Start timer
    startPollTimer(poll.id, poll.timeLimit);

    // Broadcast to all clients
    io.emit('poll-created', poll);
    io.emit('poll-update', poll);
  });

  // Student submits answer
  socket.on('submit-answer', (answer) => {
    const student = students.get(socket.id);
    if (!student || !currentPoll || !currentPoll.isActive) {
      socket.emit('error', 'Cannot submit answer: poll not active or student not found');
      return;
    }

    if (student.hasAnswered) {
      socket.emit('error', 'You have already answered this question');
      return;
    }

    // Record answer
    student.hasAnswered = true;
    student.currentAnswer = answer;
    currentPoll.answers.set(socket.id, answer);

    // Update results
    updatePollResults();

    // Notify all clients
    io.emit('answer-submitted', {
      studentName: student.name,
      answer,
      pollResults: currentPoll.results
    });

    // Check if all students have answered
    if (allStudentsAnswered()) {
      endPoll();
    }
  });

  // Chat functionality
  socket.on('send-message', (messageData) => {
    const user = students.get(socket.id) || teachers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      sender: user.name,
      senderType: students.has(socket.id) ? 'student' : 'teacher',
      content: messageData.content,
      timestamp: new Date()
    };

    chatMessages.push(message);
    io.emit('new-message', message);
  });

  // Teacher removes student
  socket.on('remove-student', (studentSocketId) => {
    const student = students.get(studentSocketId);
    if (student) {
      students.delete(studentSocketId);
      io.to(studentSocketId).emit('removed-by-teacher');
      io.to('teachers').emit('student-list-update', Array.from(students.values()));
      io.to('students').emit('student-removed', student.name);
    }
  });

  // Teacher ends poll early
  socket.on('end-poll', () => {
    if (currentPoll && currentPoll.isActive) {
      endPoll();
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from appropriate collections
    students.delete(socket.id);
    teachers.delete(socket.id);
    
    // Notify remaining users
    io.to('teachers').emit('student-list-update', Array.from(students.values()));
  });
});

// Helper functions
function canAskNewQuestion() {
  if (!currentPoll) return true;
  if (!currentPoll.isActive) return true;
  return allStudentsAnswered();
}

function allStudentsAnswered() {
  if (students.size === 0) return true;
  return Array.from(students.values()).every(student => student.hasAnswered);
}

function updatePollResults() {
  if (!currentPoll) return;

  const results = {};
  currentPoll.options.forEach(option => {
    results[option] = 0;
  });

  currentPoll.answers.forEach(answer => {
    if (results[answer] !== undefined) {
      results[answer]++;
    }
  });

  currentPoll.results = results;
}

function startPollTimer(pollId, timeLimit) {
  if (pollTimer) {
    clearTimeout(pollTimer);
  }

  pollTimer = setTimeout(() => {
    if (currentPoll && currentPoll.id === pollId && currentPoll.isActive) {
      endPoll();
    }
  }, timeLimit * 1000);
}

function endPoll() {
  if (!currentPoll) return;

  currentPoll.isActive = false;
  updatePollResults();
  
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }

  io.emit('poll-ended', {
    poll: currentPoll,
    results: currentPoll.results
  });
}

// API endpoints
app.get('/api/polls', (req, res) => {
  res.json(Array.from(polls.values()));
});

app.get('/api/students', (req, res) => {
  res.json(Array.from(students.values()));
});

app.get('/api/chat', (req, res) => {
  res.json(chatMessages);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 