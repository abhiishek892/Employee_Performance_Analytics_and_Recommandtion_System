import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, LogOut, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark"><BarChart3 size={22} /></span>
        <span>Employee Performance AI</span>
      </Link>

      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/" title="Dashboard"><BarChart3 size={18} /> Dashboard</NavLink>
            <NavLink to="/employees" title="Employees"><Users size={18} /> Employees</NavLink>
            <NavLink to="/add" title="Add employee"><UserPlus size={18} /> Add</NavLink>
            <NavLink to="/ai" title="AI recommendation"><ShieldCheck size={18} /> AI</NavLink>
            <button className="icon-text-button ghost" onClick={handleLogout} title="Logout">
              <LogOut size={18} /> {user?.name || "Logout"}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
