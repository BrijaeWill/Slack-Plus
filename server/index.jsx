//server setup
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io')
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  }));
  

const server = http.createServer(app);
//Create an io server
const io = new Server(server,{
    cors:{
        origin: ['http://localhost:5173','http://localhost:3000'],
        methods: ['GET','POST'],
    },
});
io.on('connection',(socket) =>{
    console.log(`User connected ${socket.id}`);
}
)
app.get('/', (_req, res) => {
    res.send('Hello world');
  });
  
server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
  
