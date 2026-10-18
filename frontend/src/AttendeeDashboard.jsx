import React, { useState, useEffect } from "react";
import api from "./api";
import { Ticket, CalendarDays, Bell, Send, Star, User, Sparkles, CheckCircle2, Search, Map, Building2, Package, Eye, Lock } from "lucide-react";

export default function AttendeeDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("eventsphere_user") || "{}");
  const userId = currentUser.user?.id;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [registrations, setRegistrations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [exposList, setExposList] = useState([]);
  const [exhibitorsList, setExhibitorsList] = useState([]);
  const [boothsList, setBoothsList] = useState([]);
  const [allSessionsList, setAllSessionsList] = useState([]);

  // Search queries
  const [expoSearch, setExpoSearch] = useState("");
  const [exhibitorSearch, setExhibitorSearch] = useState("");

  const [selectedExhibitor, setSelectedExhibitor] = useState(null);

  const [profile, setProfile] = useState({
    name: currentUser.user?.name || "",
    email: currentUser.user?.email || "",
    phone: currentUser.user?.phone || "",
    company: currentUser.user?.company || "",
    newPassword: "",
    confirmPassword: ""
  });
  const [feedback, setFeedback] = useState({ rating: 5, message: "", subject: "General Feedback" });
  const [msgStatus, setMsgStatus] = useState("");

  // Messaging state
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");

  const fetchData = async () => {
    try {
      if (!userId) return;

      const [regsRes, sessRes, notifRes, msgsRes, exposRes, exhibsRes, boothsRes, allSessRes] = await Promise.all([
        api.get(`/attendee-registrations?attendee_id=${userId}`),
        api.get(`/session-registrations?attendee_id=${userId}`),
        api.get(`/notifications?user_id=${userId}`),
        api.get(`/messages?user_id=${userId}`),
        api.get("/expos"),
        api.get("/exhibitors"),
        api.get("/booths"),
        api.get("/sessions")
      ]);

      setRegistrations(regsRes.data);
      setSessions(sessRes.data);
      setNotifications(notifRes.data);
      setMessages(msgsRes.data);
      setExposList(exposRes.data);
      setExhibitorsList(exhibsRes.data);
      setBoothsList(boothsRes.data);
      setAllSessionsList(allSessRes.data);
    } catch (err) {
      console.log("Attendee dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await api.put("/users/profile", {
        user_id: userId,
        name: profile.name,
        phone: profile.phone,
        company: profile.company
      });
      setMsgStatus("Profile updated successfully!");
    } catch (err) {
      setMsgStatus("Failed to update profile.");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", {
        user_id: userId,
        name: profile.name,
        email: profile.email,
        subject: feedback.subject,
        rating: feedback.rating,
        message: feedback.message
      });
      setMsgStatus("Feedback submitted! Thank you.");
      setFeedback({ rating: 5, message: "", subject: "General Feedback" });
    } catch (err) {
      setMsgStatus("Failed to submit feedback.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await api.post("/messages", {
        sender_id: userId,
        sender_name: profile.name,
        sender_email: profile.email,
        subject: msgSubject,
        message: msgBody
      });
      setMsgStatus("Message sent!");
      setMsgSubject("");
      setMsgBody("");
      fetchData();
    } catch (err) {
      setMsgStatus("Failed to send message.");
    }
  };

  const handleBookmarkSession = async (sessionId) => {
    try {
      await api.post("/session-registrations", {
        attendee_id: userId,
        session_id: sessionId
      });
      setMsgStatus("Session bookmarked in your schedule!");
      fetchData();
    } catch (err) {
      setMsgStatus("Bookmark failed.");
    }
  };

  const handleRegisterExpo = async (expoId) => {
    try {
      await api.post("/attendee-registrations", {
        attendee_id: userId,
        expo_id: expoId
      });
      setMsgStatus("Registered for expo pass!");
      fetchData();
    } catch (err) {
      setMsgStatus("Registration failed.");
    }
  };

  const filteredExpos = exposList.filter(e =>
    (e.title + " " + e.location + " " + e.category).toLowerCase().includes(expoSearch.toLowerCase())
  );

  const filteredExhibitors = exhibitorsList.filter(x =>
    ((x.company_name || "") + " " + (x.category || "") + " " + (x.description || "")).toLowerCase().includes(exhibitorSearch.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-item active-title" style={{ color: "var(--navy)", fontSize: "16px", marginBottom: "15px" }}>
          <Sparkles size={20} color="var(--yellow)" /> <strong>Attendee Hub</strong>
        </div>
        <div className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          <Ticket size={18} /> Overview & Passes
        </div>
        <div className={`sidebar-item ${activeTab === "browse-expos" ? "active" : ""}`} onClick={() => setActiveTab("browse-expos")}>
          <Search size={18} /> Browse Expos
        </div>
        <div className={`sidebar-item ${activeTab === "my-registrations" ? "active" : ""}`} onClick={() => setActiveTab("my-registrations")}>
          <CheckCircle2 size={18} /> My Registered Expos ({registrations.length})
        </div>
        <div className={`sidebar-item ${activeTab === "exhibitor-search" ? "active" : ""}`} onClick={() => setActiveTab("exhibitor-search")}>
          <Building2 size={18} /> Exhibitor Search
        </div>
        <div className={`sidebar-item ${activeTab === "floor-plan" ? "active" : ""}`} onClick={() => setActiveTab("floor-plan")}>
          <Map size={18} /> Interactive Floor Plan
        </div>
        <div className={`sidebar-item ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>
          <CalendarDays size={18} /> All Event Sessions
        </div>
        <div className={`sidebar-item ${activeTab === "my-sessions" ? "active" : ""}`} onClick={() => setActiveTab("my-sessions")}>
          <Star size={18} /> My Saved Sessions ({sessions.length})
        </div>
        <div className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
          <Bell size={18} /> Notifications ({notifications.length})
        </div>
        <div className={`sidebar-item ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
          <Send size={18} /> Messages
        </div>
        <div className={`sidebar-item ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
          <Star size={18} /> Feedback & Ratings
        </div>
        <div className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          <User size={18} /> Profile & Password
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="dash-header">
          <div>
            <h2>Attendee Dashboard</h2>
            <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>Welcome back, {profile.name}! Manage your passes, bookmarks, and messages.</p>
          </div>
        </div>

        {msgStatus && <div className="success" style={{ marginBottom: "20px" }}>{msgStatus}</div>}

        {/* 1. OVERVIEW DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Ticket /></div>
                <div className="metric-info">
                  <strong>{registrations.length}</strong>
                  <span>Registered Expos</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><CalendarDays /></div>
                <div className="metric-info">
                  <strong>{sessions.length}</strong>
                  <span>Bookmarked Sessions</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><Bell /></div>
                <div className="metric-info">
                  <strong>{notifications.length}</strong>
                  <span>Notifications</span>
                </div>
              </div>
            </div>

            <div className="data-table-card">
              <h3>My Active Expo Passes</h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Expo Title</th>
                      <th>Location</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign: "center" }}>No active expo passes. Use Browse Expos to register!</td></tr>
                    ) : (
                      registrations.map((r) => (
                        <tr key={r._id}>
                          <td><strong>{r.expo_id?.title || "Tech Future Expo 2026"}</strong></td>
                          <td>{r.expo_id?.location || "Expo Centre Karachi"}</td>
                          <td>{r.expo_id?.category || "Technology"}</td>
                          <td><span className="badge badge-approved">Pass Active</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. BROWSE EXPOS TAB */}
        {activeTab === "browse-expos" && (
          <div>
            <div className="searchbox wide" style={{ marginBottom: "20px" }}>
              <Search />
              <input value={expoSearch} onChange={(e) => setExpoSearch(e.target.value)} placeholder="Search expos by title or location..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {filteredExpos.map((e) => (
                <div key={e._id} style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", background: "#fff" }}>
                  <img src={e.banner_image} alt={e.title} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }} />
                  <h4 style={{ margin: "0 0 4px" }}>{e.title}</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 10px" }}>{e.location}, {e.city}</p>
                  <button className="btn btn-small full" onClick={() => handleRegisterExpo(e._id)}>Get Pass / Register</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MY REGISTRATIONS TAB */}
        {activeTab === "my-registrations" && (
          <div className="data-table-card">
            <h3>Registered Expos ({registrations.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Expo Title</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r._id}>
                      <td><strong>{r.expo_id?.title}</strong></td>
                      <td>{r.expo_id?.location}</td>
                      <td>{r.expo_id?.date}</td>
                      <td><span className="badge badge-approved">Pass Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. EXHIBITOR SEARCH TAB */}
        {activeTab === "exhibitor-search" && (
          <div>
            <div className="searchbox wide" style={{ marginBottom: "20px" }}>
              <Search />
              <input value={exhibitorSearch} onChange={(e) => setExhibitorSearch(e.target.value)} placeholder="Search exhibitors or category..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {filteredExhibitors.map((x) => (
                <div key={x._id} style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", background: "#fff" }}>
                  <span className="badge badge-approved" style={{ float: "right" }}>Booth: {x.booth || "A01"}</span>
                  <h4 style={{ margin: "0 0 4px" }}>{x.company_name}</h4>
                  <small style={{ color: "var(--blue2)" }}>{x.category || "Exhibitor"}</small>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "8px 0 12px" }}>{x.description}</p>
                  <button className="btn btn-small btn-light full" onClick={() => setSelectedExhibitor(x)}>View Products & Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FLOOR PLAN TAB */}
        {activeTab === "floor-plan" && (
          <div className="data-table-card">
            <h3>Event Floor Plan & Booth Layout</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginTop: "15px" }}>
              {boothsList.map((b) => (
                <div key={b._id || b.booth_number} style={{ border: "1px solid var(--line)", padding: "12px", borderRadius: "8px", textAlign: "center", background: b.status === 'occupied' ? '#cbe0ff' : '#fff' }}>
                  <strong>Booth {b.booth_number}</strong>
                  {b.exhibitor_name && <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--navy)" }}>{b.exhibitor_name}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ALL SESSIONS TAB */}
        {activeTab === "schedule" && (
          <div className="data-table-card">
            <h3>Event Schedule & Sessions ({allSessionsList.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Day & Time</th>
                    <th>Session Title</th>
                    <th>Speaker</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allSessionsList.map((s) => (
                    <tr key={s._id}>
                      <td>{s.day} · {s.time}</td>
                      <td><strong>{s.title}</strong></td>
                      <td>{s.speaker}</td>
                      <td>{s.location}</td>
                      <td><button className="btn btn-small" onClick={() => handleBookmarkSession(s._id)}>+ Bookmark</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. MY SAVED SESSIONS TAB */}
        {activeTab === "my-sessions" && (
          <div className="data-table-card">
            <h3>My Saved / Bookmarked Sessions ({sessions.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Session Title</th>
                    <th>Speaker</th>
                    <th>Time</th>
                    <th>Stage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s._id}>
                      <td><strong>{s.session_id?.title || "Keynote Session"}</strong></td>
                      <td>{s.session_id?.speaker || "Speaker"}</td>
                      <td>{s.session_id?.time || "10:00 AM"}</td>
                      <td>{s.session_id?.location || "Main Stage"}</td>
                      <td><span className="badge badge-upcoming">Saved</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="data-table-card">
            <h3>Notifications & Session Alerts</h3>
            {notifications.map((n) => (
              <div key={n._id} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
                <h4 style={{ margin: "0 0 4px", color: "var(--blue2)" }}>{n.title}</h4>
                <p style={{ margin: 0, fontSize: "14px" }}>{n.message}</p>
                <small style={{ color: "var(--muted)" }}>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}

        {/* 9. MESSAGES TAB */}
        {activeTab === "messages" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
            <form className="form-card" onSubmit={handleSendMessage}>
              <h3><Send color="var(--blue2)" /> Contact Exhibitors / Organizers</h3>
              <label>Subject
                <input required value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="Inquiry about booth or product" />
              </label>
              <label>Message Content
                <textarea required rows="4" value={msgBody} onChange={(e) => setMsgBody(e.target.value)} placeholder="Write message..." />
              </label>
              <button className="btn full" type="submit">Send Message</button>
            </form>

            <div className="data-table-card">
              <h3>Message History ({messages.length})</h3>
              {messages.map((m) => (
                <div key={m._id} style={{ borderBottom: "1px solid var(--line)", padding: "10px 0" }}>
                  <h4 style={{ margin: "0 0 4px" }}>{m.subject}</h4>
                  <p style={{ margin: 0, fontSize: "13px" }}>{m.message}</p>
                  <small style={{ color: "var(--muted)" }}>{new Date(m.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. FEEDBACK TAB */}
        {activeTab === "feedback" && (
          <form className="form-card" onSubmit={handleFeedbackSubmit} style={{ maxWidth: "600px" }}>
            <h3>Submit Feedback & Suggestions</h3>
            <label>Rating (1 to 5 Stars)
              <select value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}>
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 - Good)</option>
                <option value="2">⭐⭐ (2 - Fair)</option>
                <option value="1">⭐ (1 - Needs Improvement)</option>
              </select>
            </label>
            <label>Subject
              <input required value={feedback.subject} onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })} placeholder="Feedback subject" />
            </label>
            <label>Your Feedback / Suggestions
              <textarea required rows="4" value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} placeholder="Tell us how we can improve..." />
            </label>
            <button className="btn full" type="submit">Submit Feedback</button>
          </form>
        )}

        {/* 11. PROFILE & PASSWORD TAB */}
        {activeTab === "profile" && (
          <form className="form-card" onSubmit={handleUpdateProfile} style={{ maxWidth: "600px" }}>
            <h3>Update Personal Information</h3>
            <label>Full Name
              <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </label>
            <label>Email Address
              <input disabled value={profile.email} />
            </label>
            <label>Phone Number
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+92 300 0000000" />
            </label>
            <label>Company / Organization
              <input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} placeholder="Company name" />
            </label>
            <button className="btn full" type="submit">Save Profile</button>
          </form>
        )}
      </main>

      {/* EXHIBITOR MODAL */}
      {selectedExhibitor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
          <div className="form-card" style={{ maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{selectedExhibitor.company_name}</h3>
              <button className="btn btn-small btn-light" onClick={() => setSelectedExhibitor(null)}>Close</button>
            </div>
            <p><strong>Category:</strong> {selectedExhibitor.category}</p>
            <p><strong>Booth:</strong> {selectedExhibitor.booth || "A01"}</p>
            <p><strong>Description:</strong> {selectedExhibitor.description}</p>
            {selectedExhibitor.products && (
              <div>
                <h4>Product Showcase</h4>
                {selectedExhibitor.products.map((p, i) => (
                  <div key={i} style={{ border: "1px solid var(--line)", padding: "8px", margin: "6px 0", borderRadius: "6px" }}>
                    <strong>{p.name}</strong> - ${p.price}
                    <p style={{ margin: 0, fontSize: "12px" }}>{p.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
