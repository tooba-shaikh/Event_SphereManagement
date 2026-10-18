import React, { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import api from "../api";
import { PageHero } from "./Expos";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", form);
      setSent(true);
    } catch (err) {
      setSent(true);
    }
  };

  return (
    <>
      <PageHero kicker="CONTACT" title="Let’s talk events." text="Questions, partnerships or support — send us a message." />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>Our team is here to help with EventSphere and expo participation.</p>
            <div><Mail /><span><small>Email</small>hello@eventsphere.local</span></div>
            <div><Phone /><span><small>Phone</small>+92 21 0000 0000</span></div>
            <div><MapPin /><span><small>Office</small>Karachi, Pakistan</span></div>
          </div>
          <form className="form-card" onSubmit={handleSubmit}>
            <label>Name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </label>
            <label>Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </label>
            <label>Subject
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
            </label>
            <label>Message
              <textarea required rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your message..." />
            </label>
            <button className="btn full">Send message <ArrowRight /></button>
            {sent && <div className="success">Thank you! Your message has been sent to our backend.</div>}
          </form>
        </div>
      </section>
    </>
  );
}
