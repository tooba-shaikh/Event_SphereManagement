import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Logo } from "../../components/common/Navbar";
import api from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await api.post("/forgot-password", { email });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="kicker yellow">EVENTSPHERE</span>
          <h1>Reset your password</h1>
          <p>We will generate a reset token and send instructions to your email address.</p>
        </div>
        <small>Secure. Fast. Connected.</small>
      </div>

      <div className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <h2>Forgot Password</h2>
          <p>Enter your account email to initiate password reset.</p>

          {error && <div style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}>{error}</div>}
          {msg && <div className="success" style={{ marginBottom: "15px" }}>{msg}</div>}

          <label>Email address
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>

          <button className="btn full" type="submit">Send Reset Token <ArrowRight /></button>

          <div className="auth-switch">
            <Link to="/login">Back to Sign in</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
