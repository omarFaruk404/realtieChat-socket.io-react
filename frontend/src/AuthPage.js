
import React, { useState,useEffect} from 'react';
import './AuthPage.css'; 


const AuthPage = ({ socket,updateUserName }) => {

  const [userName, setUserName] = useState('');
  const [passWord, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleStatus = (response) => {
    console.log("handle status done")
    if (response.success) {
      localStorage.setItem('userName', response.userName);
      updateUserName(response.userName);
    } else {
      alert(response.message);
    }
  };



  useEffect(()=>{
    socket.on('status', handleStatus);
    return () => {
      socket.off('status', handleStatus);
    };
  },[])

  const handleSubmit = async() => {
    console.log("clicked")
    if(isSignUp){
      socket.emit("signup",{userName,passWord})
    }else{
      socket.emit("login",{userName,passWord})
    }
  }





  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

          <label>UserName</label>
          <input
            className='authInput'
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label>Password</label>
          <input 
            className='authInput'
            type="password"
            value={passWord}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <div>

            </div>
          )}

          <button  className="authPageButton" onClick={handleSubmit} type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>


        <p className="authpageP" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
        </p>
      </div>
      <div className='footer'>Designed & Developed By Omar</div>
    </div>
  );
};

export default AuthPage;