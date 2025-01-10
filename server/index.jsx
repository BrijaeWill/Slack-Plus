const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const leaveRoom = require('./utils/leave-room');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected:', res.rows);
    }
});


// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
}));
app.use(express.json());

// Hash a password
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Verify a password
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT
function generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).send('Invalid Token');
    }
}

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).send('User already exists');
        }

        // Hash the password and insert the user
        const hashedPassword = await hashPassword(password);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];
        if (!user) return res.status(404).send('User not found');

        // Verify the password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Invalid credentials');

        // Generate a token
        const token = generateToken(user.id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Protected route (requires valid JWT)
app.get('/protected', authenticateToken, (req, res) => {
    res.send(`Hello, ${req.user.username}`);
});

// WebSocket server setup
const server = http.createServer(app);
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

    // Handle user leaving the chat
    socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        
        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('receive_message', {
          username: CHAT_BOT,
          message: `${username} has left the chat`,
          __createdtime__,
        });
        console.log(`${username} has left the chat`);
      });
    
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
