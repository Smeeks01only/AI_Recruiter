import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import "./HRNavbar.css";

const HRNavbar = () => {
  return (
    <header className="hr-navbar">
      <Link
        to="/hr/dashboard"
        className="hr-navbar-brand"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        AI Powered Recruitment System
      </Link>

      <nav className="hr-navbar-nav">
        <NavLink to="/hr/dashboard" className="hr-nav-link">
          <DashboardIcon />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/hr/applications" className="hr-nav-link">
          <ListAltIcon />
          <span>Applications</span>
        </NavLink>
        <NavLink to="/hr/profile" className="hr-nav-link">
          <AccountCircleIcon />
          <span>Profile</span>
        </NavLink>
        <span>
          <LogoutButton />
        </span>
      </nav>
    </header>
  );
};

export default HRNavbar;
