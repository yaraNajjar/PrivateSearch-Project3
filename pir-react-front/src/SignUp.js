import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for HTTP requests
import './SignUp.css'; // Import CSS file for SignUp component

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const queryParams = `?username=${username}&email=${email}&password=${password}`;
      const response = await axios.post(`http://localhost:8082/api/users/register${queryParams}`);
      navigate("/login");
    } catch (error) {
      console.error("Error adding user:", error);
    }
};
  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
            <label >User Name:</label>
            <input
            type="text"

            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>

        <div className="form-group">
          <label >Email:</label>
          <input
            type="text"

            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label >Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <button  type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <button onClick={()=>{navigate("/login");}}>Login</button></p>
    </div>
  );
};

export default SignUp;
