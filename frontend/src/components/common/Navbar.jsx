import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sparkles, Menu, X, LogOut } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark"><Sparkles size={20} /></span>
      <span>Event<span>Sphere</span></span>
    </Link>
  );
}

export default function Navbar({ currentUser, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container nav">
        <Logo />
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "navlinks open" : "navlinks"} onClick={() => setOpen(false)}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/expos">Expos</NavLink>
          <NavLink to="/exhibitors">Exhibitors</NavLink>
          <NavLink to="/schedule">Schedule</NavLink>
          <NavLink to="/floor-plan">Floor Plan</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {currentUser && (currentUser.user?.role === "admin" || currentUser.user?.role === "organizer") && (
            <NavLink to="/admin" style={{ color: "var(--yellow)", fontWeight: "800" }}>Admin Dashboard</NavLink>
          )}
          {currentUser && currentUser.user?.role === "exhibitor" && (
            <NavLink to="/exhibitor-portal" style={{ color: "var(--yellow)", fontWeight: "800" }}>Exhibitor Portal</NavLink>
          )}
          {currentUser && (currentUser.user?.role === "attendee" || !currentUser.user?.role) && (
            <NavLink to="/attendee-dashboard" style={{ color: "var(--yellow)", fontWeight: "800" }}>Attendee Dashboard</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {currentUser ? (
            <div className="user-badge">
              <div className="user-avatar">{currentUser.user?.name ? currentUser.user.name[0].toUpperCase() : "U"}</div>
              <span>{currentUser.user?.name} ({currentUser.user?.role})</span>
              <button onClick={onLogout} style={{ border: 0, background: "none", cursor: "pointer", color: "var(--muted)", marginLeft: "5px" }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link className="login-link" to="/login">Sign in</Link>
              <Link className="btn btn-small" to="/register">Join EventSphere</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
