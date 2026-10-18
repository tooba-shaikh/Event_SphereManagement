import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, ArrowRight } from "lucide-react";
import { Logo } from "./Navbar";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>One place to discover expos, meet exhibitors and make every event connection count.</p>
          <div className="socials">
            <span><Instagram /></span><span><Linkedin /></span><span><Facebook /></span>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/expos">Upcoming Expos</Link>
          <Link to="/exhibitors">Exhibitors</Link>
          <Link to="/schedule">Schedule</Link>
          <Link to="/floor-plan">Floor Plan</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Create account</Link>
        </div>
        <div>
          <h4>Stay connected</h4>
          <p className="small">Get updates about new expos and opportunities.</p>
          <div className="newsletter">
            <input placeholder="Email address" /><button aria-label="Subscribe"><ArrowRight /></button>
          </div>
        </div>
      </div>
      <div className="container copyright">© 2026 EventSphere Management. Built for better event experiences.</div>
    </footer>
  );
}
