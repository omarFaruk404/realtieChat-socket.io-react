const fs = require('fs');
const https = require('https');
// const http = require('http')
const express = require('express');
const socketIO = require("socket.io");
const HashTable = require('./hashTable.js');
const app = express();
const server = https.createServer({
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt')
}, app);

// const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "https://chat.candidme.link,http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let messages = [];
let userDatabase = new HashTable();
let userOnline = new Set();

io.on('connection', (socket) => {

  userOnline.add(socket.id);
  console.log("total userOnline "+ userOnline.size)
  io.emit("userOnline",userOnline.size);

  socket.on('disconnect',()=>{

    userOnline.delete(socket.id);
    console.log("total userOnline "+ userOnline.size)
    io.emit("userOnline",userOnline.size)
  })
  socket.on("getUserOnline",()=>{
    socket.emit("latestUserOnline",userOnline.size);
  })
  socket.on('signup', (credentials) => {
    const userName = credentials.userName;
    const response = userDatabase.getItem(userName);
    if (response == null) {
      userDatabase.setItem(userName, credentials);
      socket.emit("status", { success: true, userName: userName, message: `User ${userName} created` })
    } else {
      socket.emit("status", { success: false, message: `User ${userName} already exists` })
    }
  });

  socket.on("login", (credentials) => {
    const userName = credentials.userName;
    const passWord = credentials.passWord;
    const response = userDatabase.getItem(userName);
    if (response == null) {
      socket.emit("status", { success: false, message: `User ${userName} does not exist` })
    } else {
      if (userName == response.userName && passWord == response.passWord) {
        socket.emit("status", { success: true, userName: userName })
      } else {
        socket.emit("status", { success: false, message: "Wrong password" })
      }
    }
  });

  socket.on('chatMessage', (data) => {
    messages.push(data);
    io.emit('chatMessage', data);
  });

  socket.on('typing',(userName)=>{
    io.emit("startedTyping",userName)
  })
  socket.on('stoppedTyping',(userName)=>{
    io.emit("notTyping",userName)

  })
});

app.get("/getMessages",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', 'https://chat.candidme.link');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, my-custom-header');
  res.json({messages:messages})
})
app.get("/flushMessages",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', 'https://chat.candidme.link');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, my-custom-header');
  messages =[];
  res.json({messages:messages})
})



const PORT = 443;

server.listen(PORT, () => {
  console.log(`Server listening on https://localhost:${PORT}`);
});