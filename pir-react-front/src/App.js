// App.js
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUp from "./SignUp";



import "./App.css"; // Import CSS for styling
import Products from "./components/user/Products";
import History from "./components/user/History";

import AdminProducts from "./components/admin/Products";
import Home from "./components/Home";

import AdminUsers from "./components/admin/Users";

import Navbar from "./Navbar"; // Import the Navbar component
import Sidebar from "./Sidebar";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };
  const login = () => {
    setIsLoggedIn(true);
  };
  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} logout={logout} />}{" "}
        {/* Render navbar if logged in */}
        <div className="main">
          {isLoggedIn && <Sidebar isLoggedIn={isLoggedIn} />}{" "}
          {/* Render navbar if logged in */}
          <div className="content">
            <Routes>
              <Route path="/login" element={<LoginPage login={login} />} />
              <Route path="/SignUp" element={<SignUp  />} />

              <Route
                path="/"
                element={
                  !isLoggedIn ? (
                    <LoginPage login={login} />
                  ) : (
                    <Navigate to="/Home" />
                  )
                }
              />
              <Route
                path="/Home"
                element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/products"
                element={isLoggedIn ? <Products /> : <Navigate to="/login" />}
              />
              <Route
                path="/admin-products"
                element={
                  isLoggedIn ? <AdminProducts /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/admin-users"
                element={
                  isLoggedIn ? <AdminUsers /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/history"
                element={
                isLoggedIn ? <History /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
