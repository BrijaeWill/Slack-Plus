const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);

// Create an io server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

const CHAT_BOT = 'CHATBOT';
let chatRoom = ''; // Tracks the current chat room
let allUsers = []; // Stores all connected users

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for 'join_room' event
  socket.on('join_room', (data) => {
    const { username, room } = data; // Destructure room and username
    chatRoom = room;
    socket.join(room);

    // Add the new user to the allUsers array
    allUsers.push({ id: socket.id, username, room });

    // Get all users in the same room
    const chatRoomUsers = allUsers.filter((user) => user.room === room);

    // Broadcast updated user list to the room
    io.to(room).emit('chatroom_users', chatRoomUsers);

    // Send a message to all users in the room
    const _createdtime_ = Date.now();
    io.to(room).emit('receive_message', {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      _createdtime_,
    });

    // Send a welcome message to the new user
    socket.emit('receive_message', {
      message: (`Welcome ${username}`),
      username: CHAT_BOT,
      _createdtime_,
    });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove the user from allUsers array
    allUsers = allUsers.filter((user) => user.id !== socket.id);

    // Broadcast updated user list to the room
    const chatRoomUsers = allUsers.filter((user) => user.room === chatRoom);
    io.to(chatRoom).emit('chatroom_users', chatRoomUsers);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

