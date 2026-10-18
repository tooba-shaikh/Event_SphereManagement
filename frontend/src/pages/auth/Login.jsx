import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, ShieldCheck, Building2, Ticket } from "lucide-react";
import { Logo } from "../../components/common/Navbar";
import api from "../../api";

export default function Login({ onLoginSuccess }) {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const performLogin = async (email, password) => {
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("eventsphere_user", JSON.stringify(res.data));
      if (res.data.token) {
        localStorage.setItem("eventsphere_token", res.data.token);
      }
      onLoginSuccess(res.data);

      const userRole = res.data.user?.role;
      if (userRole === "admin" || userRole === "organizer") {
        nav("/admin");
      } else if (userRole === "exhibitor") {
        nav("/exhibitor-portal");
      } else {
        nav("/attendee-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    performLogin(formData.email, formData.password);
  };

  return (
    <section className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="kicker yellow">EVENTSPHERE PLATFORM</span>
          <h1>Make every event connection count.</h1>
          <p>Discover expos, meet exhibitors and plan your experience in one central database portal.</p>
        </div>
        <small>Simple. Professional. Connected.</small>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your EventSphere control panel.</p>

      

          <form onSubmit={submit}>
            {error && <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "15px" }}>{error}</div>}

            <label>Email address
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
            </label>

            <label>Password
              <div className="password">
                <input required type={show ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" />
                <button type="button" onClick={() => setShow(!show)}><Eye /></button>
              </div>
            </label>

            <div className="form-row" style={{ marginBottom: "15px" }}>
              <label className="remember"><input type="checkbox" /> Remember me</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button className="btn full" type="submit">Sign in <ArrowRight /></button>

            <div className="auth-switch">
              New here? <Link to="/register">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
