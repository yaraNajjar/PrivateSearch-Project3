import React, { useState } from "react";
import Modal from "react-modal"; // Import the modal library
import axios from "axios"; // Import Axios for HTTP requests
import dummyData from "../../dummyData"; // Import dummy data
import "./Products.css"; // Importing the CSS file
import AddProductForm from "./AddUserForm";

const Users = () => {
  const [user, setUser] = useState({id:"",username:"",email:"",password:"",admin:""}); // State for user
  const [users, setUsers] = useState([]); // State for users
  // State declarations
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearch = async() => {
    const response = await axios.get(`http://localhost:8082/api/users/searchUser?userId=${searchTerm}`);
    console.log(response);
    const data = response.data;
    const newUser={id:data.id,username:data.username,email:data.email,password:data.password,admin:data.admin};
    setUser(newUser);
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8082/api/users/delete/${id}?isAdmin=true`);
      alert(`User '${id}' deleted`);
      //setusers(filtered);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleViewAllUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/users/all?isAdmin=true`);
        const data = response.data;
        setUsers([...data]);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };
  const handleSubmitUser = async(newUser) => {
    try {
      const queryParams = `?username=${newUser.username}&email=${newUser.email}&password=${newUser.password}&admin=${newUser.admin}`;
      const response = await axios.post(`http://localhost:8082/api/users/register${queryParams}`);
      console.log(response);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  return (
    <div>
      <h2>users</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Password</th>
            <th>Is Admin</th>
          </tr>
        </thead>
        <tbody>
              <tr>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.admin ? "Yes" : "No"}</td>
            </tr>
                <button
                  className="delete-button"
                  onClick={() => {
                    handleDelete(user.id);
                  }}
                >
                  Delete
                </button>
        </tbody>

    <div>
        <button className="add-button" onClick={handleAddUser}>
          Add New User
        </button>
      </div>
    <div>
        <button className="viewAll-button" onClick={handleViewAllUsers}>
         View All Users
        </button>
      </div>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Password</th>
            <th>Is Admin</th>
          </tr>
        </thead>
        <tbody>
            {users.map((u)=>(
                        <tr key={u.id} >
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.password}</td>
                                <td>{u.admin ? "Yes" : "No"}</td>
                        </tr>))}


        </tbody>


      </table>

      <Modal
        isOpen={showAddForm}
        onRequestClose={handleCloseAddForm}
        className="add-user-modal"
        overlayClassName="modal-overlay"
      >

               <AddProductForm
                onSubmit={handleSubmitUser}
                onClose={handleCloseAddForm}
                />
             </Modal>
    </div>
  );
};

export default Users;
