// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          {localStorage.getItem("isAdmin") === "true" ? (
            <NavLink to="/admin-products">admin products</NavLink>
          ) : (
            <NavLink to="/products">products</NavLink>
          )}
        </li>
        <li>
          {localStorage.getItem("isAdmin") === "true" ? (
            <NavLink to="/admin-users">admin users</NavLink>
          ) : (
                null
          )}
        </li>
        <li>
               {localStorage.getItem("isAdmin") === "true" ? (
                <NavLink to="/history">history</NavLink>
                  ) : (
                    <NavLink to="/history">history</NavLink>
                  )}
         </li>
      </ul>
    </div>
  );
};

export default Sidebar;
