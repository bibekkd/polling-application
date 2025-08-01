# Real-Time Polling App

A modern, real-time polling application built with Next.js, Socket.IO, and TypeScript. Perfect for classroom interactions, presentations, and live audience engagement.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and multiple choice options
- ✅ View live polling results in real-time
- ✅ Configurable time limits (30 seconds to 5 minutes)
- ✅ End polls early or let them run to completion
- ✅ Remove students from the session
- ✅ Real-time chat with students
- ✅ View student participation status

### Student Features
- ✅ Join sessions with unique names
- ✅ Submit answers once per poll
- ✅ View live results after submission
- ✅ Real-time countdown timer
- ✅ Chat with teacher and other students
- ✅ Automatic removal handling

### Real-Time Features
- ✅ Live updates for all users
- ✅ Real-time poll results with visual charts
- ✅ Live chat functionality
- ✅ Connection status indicators
- ✅ Automatic poll ending when all students answer

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: Socket.IO
- **UI Components**: Lucide React Icons
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd polling-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. In a separate terminal, start the Socket.IO server:
```bash
npm run server
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### For Teachers

1. Click "Join as Teacher" on the home page
2. Enter your name and join the session
3. Create a new poll by clicking "New Poll"
4. Enter your question and add multiple choice options
5. Set a time limit and create the poll
6. Monitor student responses in real-time
7. Use the chat feature to communicate with students
8. Remove students if needed using the student list

### For Students

1. Click "Join as Student" on the home page
2. Enter your name and join the session
3. Wait for the teacher to create a poll
4. Select your answer when the poll appears
5. Submit your answer (you can only answer once per poll)
6. View live results after submission
7. Use the chat feature to communicate

## Project Structure

```
polling-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page with role selection
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── RoleSelection.tsx
│   ├── CreatePollModal.tsx
│   ├── PollResults.tsx
│   ├── StudentList.tsx
│   └── ChatModal.tsx
├── hooks/                 # Custom React hooks
│   └── useSocket.ts       # Socket.IO connection hook
├── types/                 # TypeScript type definitions
│   └── index.ts
├── server.js              # Socket.IO server
└── package.json
```

## Key Features Explained

### Real-Time Polling
- Teachers can create polls with custom questions and options
- Students can only answer once per poll
- Results update in real-time for all participants
- Automatic poll ending when all students answer or time expires

### Student Management
- Teachers can view all connected students
- Real-time status indicators (answered/waiting)
- Ability to remove students from the session
- Unique student identification per browser tab

### Chat System
- Real-time messaging between teachers and students
- Message history persistence during session
- Visual distinction between teacher and student messages
- Timestamp display for all messages

### Timer System
- Configurable time limits (30s to 5 minutes)
- Visual countdown for students
- Automatic poll ending when time expires
- Teachers can end polls early

## Development

### Running in Development

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Building for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## API Endpoints

The server provides the following REST endpoints:

- `GET /api/polls` - Get all polls
- `GET /api/students` - Get all connected students
- `GET /api/chat` - Get chat message history

## Socket.IO Events

### Client to Server
- `teacher-join` - Teacher joins the session
- `student-join` - Student joins the session
- `create-poll` - Teacher creates a new poll
- `submit-answer` - Student submits an answer
- `send-message` - Send a chat message
- `remove-student` - Teacher removes a student
- `end-poll` - Teacher ends poll early

### Server to Client
- `teacher-joined` - Teacher successfully joined
- `student-joined` - Student successfully joined
- `poll-created` - New poll created
- `poll-update` - Poll state updated
- `poll-ended` - Poll has ended
- `answer-submitted` - Student answer received
- `student-list-update` - Student list updated
- `chat-history` - Chat message history
- `new-message` - New chat message
- `error` - Error message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
