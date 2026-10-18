import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { Logo } from "../../components/common/Navbar";
import api from "../../api";

export default function Register({ onLoginSuccess }) {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
    company: "",
    phone: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/register", formData);
      localStorage.setItem("eventsphere_user", JSON.stringify(res.data));
      onLoginSuccess(res.data);

      if (formData.role === "admin" || formData.role === "organizer") {
        nav("/admin");
      } else if (formData.role === "exhibitor") {
        nav("/exhibitor-portal");
      } else {
        nav("/attendee-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="kicker yellow">EVENTSPHERE</span>
          <h1>Make every event connection count.</h1>
          <p>Discover expos, meet exhibitors and plan your experience in one place.</p>
        </div>
        <small>Simple. Professional. Connected.</small>
      </div>

      <div className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <h2>Create your account</h2>
          <p>Join the EventSphere community.</p>

          {error && <div style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}>{error}</div>}

          <label>Full Name
            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" />
          </label>

          <label>I am joining as
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="attendee">Attendee</option>
              <option value="exhibitor">Exhibitor</option>
              <option value="admin">Admin / Organizer</option>
            </select>
          </label>

          {formData.role === "exhibitor" && (
            <label>Company / Brand Name
              <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Company name" />
            </label>
          )}

          <label>Phone Number
            <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+92 300 0000000" />
          </label>

          <label>Email address
            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
          </label>

          <label>Password
            <div className="password">
              <input required type={show ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" />
              <button type="button" onClick={() => setShow(!show)}><Eye /></button>
            </div>
          </label>

          <button className="btn full" type="submit">Create account <ArrowRight /></button>

          <div className="auth-switch">
              Already registered? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
