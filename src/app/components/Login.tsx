"use client";
import React, { useState } from 'react';
import '../styles/Login.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username) {
      onLogin(username);
    }
  };

  return (
    <div className="login">
      <h1>Enter Your Username</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;