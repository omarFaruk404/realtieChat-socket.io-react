import './ChatBox.css';
import sendLogo from './send.png'
import userLogo from './user.png'
import loadingGif from './loading.gif'
import React, { useState, useEffect } from 'react';


const ChatBox = ({ socket }) => {


  const [messages, setMessages] = useState([
]);
  const [userName, setUsername] = useState(localStorage.getItem("userName"));
  const [newMessage, setNewMessage] = useState('');
  const[userOnline,setUserOnline]=useState(0);
  const [typing, setTyping] = useState([]);

  const addTyping = (newValue) => {
    if (!(typing.includes(newValue)) && !(newValue === localStorage.getItem("userName"))) {
      // console.log("true");

      setTyping((prevValues) => [...prevValues, newValue]);
    }
  };

  const removeTyping= (valueToRemove) => {
    setTyping((prevValues) => prevValues.filter((value) => value !== valueToRemove));
  };


useEffect(()=>{
 socket.on("userOnline",(data)=>{
    // console.log("user Online "+data);
    setUserOnline(data);
  })
  socket.on("startedTyping",(data)=>{
    // console.log(data + " is typing")
    addTyping(data);
  })
  socket.on("notTyping",(data)=>{
    // console.log(data + " isn't typing")
    removeTyping(data);
  })

  if(messages.length==0){
    fetch("https://35.194.25.224/getMessages")
    .then(response => response.json())
    .then(data => {
      setMessages(data.messages)
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }
  socket.on('chatMessage', (message) => {
    console.log("received");
    setMessages((prevMessages) => [...prevMessages, message]);
    // console.log(messages)
  });

},[])


const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent the default behavior of adding a newline
    sendMessage();
  }
};

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
    socket.emit('chatMessage', {userName: userName, message: newMessage});
    console.log("message sent");
    setNewMessage('');
    }
  };



  return (
    <div className="chat-container">
      <div className='chatTitleContainer'>
        <h3 className='chatTitle'>Group Chat</h3>
        <p className='userOnline'>Users online: {userOnline}</p>
      </div>
      <div className="message-container">
        {messages.slice().reverse().map((msg, index) => (
          <div className={`messageFlex ${(msg.userName === userName)?'left':'' }`}> 
          <div key={index} className='message' >
            <img className={`userLogo ${(msg.userName === userName)?'hidden':'' }`} src={userLogo}/>
            <div className='messageTextContainer'>
              <p className={`userName ${(msg.userName === userName)?'hidden':'' }`}>{msg.userName}</p>
              <p className={`message-text ${(msg.userName === userName)?'color':'' }`}>{msg.message}</p>
            </div>
          </div>
          </div>
        ))}

      </div>
      {typing.length>0 ?<p className='userTyping'>{typing.join(', ')} is typing  
      <img className='gif' src={loadingGif}/>    
</p>:<></>}

      <div className="input-container">
        <input
          className='messageInput'
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => {setNewMessage(e.target.value)

          }}
          onFocus={()=>{socket.emit("typing",userName)}}
          onBlur={()=>{socket.emit('stoppedTyping',userName)}}
          onKeyDown={handleKeyDown}
        />
        <button className="sendButton" onClick={sendMessage}><img className='sendButtonImg' src={sendLogo}/></button>
      </div>
    </div>
  );
};
export default ChatBox;