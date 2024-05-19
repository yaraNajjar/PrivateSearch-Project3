import React, { useState } from "react";
import "./AddProductForm.css"; // Import your CSS file

const AddUserForm = ({ onSubmit, onClose }) => {
  // State declarations for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, email, password });
    // Reset the form input values
    setUsername("");
    setEmail("");
    setPassword("");
    onClose();

  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="exit-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="modal-footer">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Exit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
