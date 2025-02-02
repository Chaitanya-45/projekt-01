const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const calendarRoutes = require('./routes/calendar');
const User = require('./models/user');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/calendar', calendarRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// After initializing io
app.set("socketio", io);

const loggedInUsers = new Map();

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('user_login', async (data) => {
    const { userId } = data;
    try {
      const user = await User.findById(userId);
      if (user) {
        loggedInUsers.set(userId, { socketId: socket.id, username: user.name });
        console.log(`User ${user.name} (ID: ${userId}) logged in`);
        io.emit('update_user_list', Array.from(loggedInUsers.values()));
      }
    } catch (error) {
      console.error('Error retrieving user information:', error);
    }
  });

  socket.on('send_private_message', (data) => {
    const { receiverId, message } = data;
    const receiver = loggedInUsers.get(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('receive_private_message', {
        senderId: data.senderId,
        message: data.message,
      });
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, userInfo] of loggedInUsers.entries()) {
      if (userInfo.socketId === socket.id) {
        loggedInUsers.delete(userId);
        console.log(`User ${userInfo.username} (ID: ${userId}) disconnected`);
        io.emit('update_user_list', Array.from(loggedInUsers.values()));
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});