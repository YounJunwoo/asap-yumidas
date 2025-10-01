import './NavBar.css';
import hamburger from "../assets/hamburger.svg"
import { useNavigate } from "react-router-dom";

const NavBar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const toHomepage = () => {
    navigate("/");
  };
  return (
    <div className="topNavbar">
      <div className="dashboard-logo">
        smartfarm <span className="logo-sub" onClick={toHomepage} style={{ cursor: "pointer" }}>ASAP</span>
      </div>

      <button class="hamburger" onClick={onToggleSidebar}>
        <img src={hamburger} alt="햄버거버튼" className="hamburgerbtn" />
      </button>
      </div>
  );
};

export default NavBar;
