import React from "react";
import './Navbar.css';
import hamburger from "../icons/lucide/hamburger.svg"

const Navbar = ({ onToggleSidebar }) => {
  

  return (
    <div className="topNavbar">
      <div className="dashboard-logo">
        smartfarm <span className="logo-sub">ASAP</span>
      </div>

      <button class="hamburger" onClick={onToggleSidebar}>
        <img src={hamburger} alt="햄버거버튼" className="hamburgerbtn" />
      </button>
      </div>
  );
};

export default Navbar;
