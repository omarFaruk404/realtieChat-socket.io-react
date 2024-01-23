import './App.css';
import React from 'react';
import { useState } from 'react';
import AuthPage from './AuthPage';
import ChatBox from './ChatBox';
import io from 'socket.io-client';
// const socket = io('http://localhost:5000/')
const socket = io('https://35.194.25.224/');

function App() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  const[userName,setUserName]= useState(localStorage.getItem("userName"))
  const updateUserName = (string) => {
    setUserName(string);
  };
  return (
<>
{userName?
<ChatBox socket={socket}/>
:
<AuthPage updateUserName={updateUserName} socket={socket} userName={userName}/>}

</>
  );
}

export default App;
