// LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";

function LoginPage({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8082/api/users/login', { email, password });
      if(response.data.email != null){
          localStorage.setItem("id", response.data.id);
          localStorage.setItem("isAdmin", response.data.admin);
          login();
          navigate("/home"); // Replace '/another-component' with the desired path
      }else{
        alert("login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

    const handleSignUp = async (e) => {
        navigate("/SignUp");
    }


  return (
    <div class="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {error && <p class="error">{error}</p>}
      </form>
      <div class="signup">
        <p>Dont have an account? <a onClick={handleSignUp} >Sign Up</a></p>
      </div>
    </div>
  );
}

export default LoginPage;
