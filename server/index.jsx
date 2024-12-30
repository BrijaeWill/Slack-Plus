//server setup
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

app.use(cors()); //Add cors middleware

const server = http.createServer(app);

server.listen(5173,()=> 'Server is runnin on port 5173');