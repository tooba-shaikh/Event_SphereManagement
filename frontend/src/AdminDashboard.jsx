import React, { useState, useEffect } from "react";
import api from "./api";
import {
  CalendarDays, Users, Building2, Ticket, Plus, CheckCircle, XCircle,
  Trash2, Edit, BarChart3, Layout, Clock3, MapPin, Sparkles, Send, Bell, Star, User, Lock, MessageSquare
} from "lucide-react";

export default function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("eventsphere_user") || "{}");
  const [activeTab, setActiveTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [expos, setExpos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [booths, setBooths] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Create/Edit Expo Form State
  const [editingExpoId, setEditingExpoId] = useState(null);
  const [expoForm, setExpoForm] = useState({
    title: "",
    description: "",
    theme: "",
    category: "Technology",
    date: "",
    start_time: "09:00 AM",
    end_time: "05:00 PM",
    location: "",
    city: "Karachi",
    banner_url: ""
  });
  const [showExpoModal, setShowExpoModal] = useState(false);

  // Create/Edit Session Form State
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    expo_id: "",
    time: "10:00 AM",
    title: "",
    speaker: "",
    location: "Main Stage",
    tag: "Keynote",
    day: "Day 1"
  });
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Booth Form State
  const [newBooth, setNewBooth] = useState({
    booth_number: "",
    size: "Standard (10x10)",
    location: "Main Hall",
    status: "available",
    exhibitor_name: ""
  });

  // Broadcast Notification Form
  const [notifForm, setNotifForm] = useState({ user_id: "", title: "", message: "", type: "info" });

  // Admin Profile & Password Form
  const [profileForm, setProfileForm] = useState({
    name: currentUser.user?.name || "Admin",
    phone: currentUser.user?.phone || "",
    company: currentUser.user?.company || "EventSphere Management",
    newPassword: "",
    confirmPassword: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        analyticsRes,
        exposRes,
        appsRes,
        sessionsRes,
        usersRes,
        boothsRes,
        msgsRes,
        feedbackRes,
        regsRes
      ] = await Promise.all([
        api.get("/analytics"),
        api.get("/expos"),
        api.get("/applications"),
        api.get("/sessions"),
        api.get("/users"),
        api.get("/booths"),
        api.get("/messages"),
        api.get("/feedback"),
        api.get("/attendee-registrations")
      ]);

      setAnalytics(analyticsRes.data);
      setExpos(exposRes.data);
      setApplications(appsRes.data);
      setSessions(sessionsRes.data);
      setUsers(usersRes.data);
      setBooths(boothsRes.data);
      setMessagesList(msgsRes.data);
      setFeedbackList(feedbackRes.data);
      setRegistrationsList(regsRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Expo CRUD
  const handleSaveExpo = async (e) => {
    e.preventDefault();
    try {
      if (editingExpoId) {
        await api.put(`/expos/${editingExpoId}`, expoForm);
        setMessage("Expo updated successfully in MongoDB!");
      } else {
        await api.post("/expos", expoForm);
        setMessage("Expo created successfully in MongoDB!");
      }
      setShowExpoModal(false);
      setEditingExpoId(null);
      setExpoForm({
        title: "", description: "", theme: "", category: "Technology", date: "",
        start_time: "09:00 AM", end_time: "05:00 PM", location: "", city: "Karachi", banner_url: ""
      });
      fetchData();
    } catch (err) {
      setMessage("Failed to save expo: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditExpo = (expo) => {
    setEditingExpoId(expo._id);
    setExpoForm({
      title: expo.title,
      description: expo.description,
      theme: expo.theme,
      category: expo.category || "Technology",
      date: expo.date,
      start_time: expo.start_time || "09:00 AM",
      end_time: expo.end_time || "05:00 PM",
      location: expo.location,
      city: expo.city || "Karachi",
      banner_url: expo.banner_image || ""
    });
    setShowExpoModal(true);
  };

  const handleDeleteExpo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expo from database?")) return;
    try {
      await api.delete(`/expos/${id}`);
      setMessage("Expo deleted successfully!");
      fetchData();
    } catch (err) {
      setMessage("Failed to delete expo.");
    }
  };

  // Application Approval
  const handleUpdateAppStatus = async (appId, status, booth) => {
    try {
      await api.put(`/applications/${appId}/status`, {
        status,
        assigned_booth: booth || "A01"
      });
      setMessage(`Application marked as ${status} in MongoDB!`);
      fetchData();
    } catch (err) {
      setMessage("Failed to update status.");
    }
  };

  // Session CRUD
  const handleSaveSession = async (e) => {
    e.preventDefault();
    try {
      if (editingSessionId) {
        await api.put(`/sessions/${editingSessionId}`, sessionForm);
        setMessage("Session updated in MongoDB!");
      } else {
        await api.post("/sessions", sessionForm);
        setMessage("Session added to schedule in MongoDB!");
      }
      setShowSessionModal(false);
      setEditingSessionId(null);
      setSessionForm({
        expo_id: "", time: "10:00 AM", title: "", speaker: "", location: "Main Stage", tag: "Keynote", day: "Day 1"
      });
      fetchData();
    } catch (err) {
      setMessage("Failed to save session.");
    }
  };

  const handleEditSession = (s) => {
    setEditingSessionId(s._id);
    setSessionForm({
      expo_id: s.expo_id || "",
      time: s.time || "10:00 AM",
      title: s.title || "",
      speaker: s.speaker || "",
      location: s.location || "Main Stage",
      tag: s.tag || "Keynote",
      day: s.day || "Day 1"
    });
    setShowSessionModal(true);
  };

  const handleDeleteSession = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
      setMessage("Session deleted from database.");
      fetchData();
    } catch (err) {
      setMessage("Failed to delete session.");
    }
  };

  // Booth Management
  const handleAllocateBooth = async (e) => {
    e.preventDefault();
    try {
      await api.post("/booths/allocate", newBooth);
      setMessage("Booth layout updated in MongoDB!");
      setNewBooth({
        booth_number: "", size: "Standard (10x10)", location: "Main Hall", status: "available", exhibitor_name: ""
      });
      fetchData();
    } catch (err) {
      setMessage("Failed to allocate booth.");
    }
  };

  const handleDeleteBooth = async (id) => {
    try {
      await api.delete(`/booths/${id}`);
      setMessage("Booth deleted.");
      fetchData();
    } catch (err) {
      setMessage("Failed to delete booth.");
    }
  };

  // Send Notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      const targetUserId = notifForm.user_id || (users.length > 0 ? users[0]._id : null);
      if (!targetUserId) {
        alert("Please select a target user.");
        return;
      }
      await api.post("/notifications", {
        user_id: targetUserId,
        title: notifForm.title,
        message: notifForm.message,
        type: notifForm.type
      });
      setMessage("Notification broadcast sent successfully!");
      setNotifForm({ user_id: "", title: "", message: "", type: "info" });
    } catch (err) {
      setMessage("Failed to send notification.");
    }
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);
      setMessage("Feedback deleted.");
      fetchData();
    } catch (err) {
      setMessage("Failed to delete feedback.");
    }
  };

  // Profile / Password Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await api.put("/users/profile", {
        user_id: currentUser.user?.id,
        name: profileForm.name,
        phone: profileForm.phone,
        company: profileForm.company
      });
      setMessage("Admin Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="container section empty">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-item active-title" style={{ color: "var(--navy)", fontSize: "16px", marginBottom: "15px" }}>
          <Sparkles size={20} color="var(--yellow)" /> <strong>Admin Console</strong>
        </div>
        <div className={`sidebar-item ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
          <BarChart3 size={18} /> Analytics & Reports
        </div>
        <div className={`sidebar-item ${activeTab === "expos" ? "active" : ""}`} onClick={() => setActiveTab("expos")}>
          <CalendarDays size={18} /> Expo Management
        </div>
        <div className={`sidebar-item ${activeTab === "applications" ? "active" : ""}`} onClick={() => setActiveTab("applications")}>
          <Building2 size={18} /> Exhibitor Apps ({applications.filter(a => a.status === 'pending').length})
        </div>
        <div className={`sidebar-item ${activeTab === "booths" ? "active" : ""}`} onClick={() => setActiveTab("booths")}>
          <Layout size={18} /> Booth Management
        </div>
        <div className={`sidebar-item ${activeTab === "sessions" ? "active" : ""}`} onClick={() => setActiveTab("sessions")}>
          <Clock3 size={18} /> Schedule & Sessions
        </div>
        <div className={`sidebar-item ${activeTab === "registrations" ? "active" : ""}`} onClick={() => setActiveTab("registrations")}>
          <Ticket size={18} /> Attendee Management
        </div>
        <div className={`sidebar-item ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
          <MessageSquare size={18} /> Messages
        </div>
        <div className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
          <Bell size={18} /> Notifications
        </div>
        <div className={`sidebar-item ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
          <Star size={18} /> Feedback
        </div>
        <div className={`sidebar-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          <Users size={18} /> User Directory
        </div>
        <div className={`sidebar-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
          <User size={18} /> Profile / Settings
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <div className="dash-header">
          <div>
            <h2>Admin / Organizer Dashboard</h2>
            <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>Manage events, exhibitors, schedule, booth maps, and live MongoDB analytics.</p>
          </div>
          {activeTab === "expos" && (
            <button className="btn" onClick={() => {
              setEditingExpoId(null);
              setExpoForm({
                title: "", description: "", theme: "", category: "Technology", date: "",
                start_time: "09:00 AM", end_time: "05:00 PM", location: "", city: "Karachi", banner_url: ""
              });
              setShowExpoModal(!showExpoModal);
            }}>
              <Plus size={18} /> Create New Expo
            </button>
          )}
          {activeTab === "sessions" && (
            <button className="btn" onClick={() => {
              setEditingSessionId(null);
              setSessionForm({
                expo_id: "", time: "10:00 AM", title: "", speaker: "", location: "Main Stage", tag: "Keynote", day: "Day 1"
              });
              setShowSessionModal(!showSessionModal);
            }}>
              <Plus size={18} /> Add Session
            </button>
          )}
        </div>

        {message && (
          <div className="success" style={{ marginBottom: "20px" }}>
            {message}
          </div>
        )}

        {/* 1. ANALYTICS & REPORTS TAB */}
        {activeTab === "analytics" && analytics && (
          <div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><CalendarDays /></div>
                <div className="metric-info">
                  <strong>{analytics.totalExpos}</strong>
                  <span>Total Expos</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><Building2 /></div>
                <div className="metric-info">
                  <strong>{analytics.totalExhibitors}</strong>
                  <span>Total Exhibitors</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><Ticket /></div>
                <div className="metric-info">
                  <strong>{analytics.totalAttendees}</strong>
                  <span>Total Attendees</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><Layout /></div>
                <div className="metric-info">
                  <strong>{analytics.boothTrafficRate}%</strong>
                  <span>Occupied Booths Rate</span>
                </div>
              </div>
            </div>

            <div className="data-table-card" style={{ marginBottom: "20px" }}>
              <h3>Live Analytics & Reports</h3>
              <p style={{ color: "var(--muted)" }}>Real-time statistics fetched directly from MongoDB collections.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "15px" }}>
                <div style={{ border: "1px solid var(--line)", padding: "15px", borderRadius: "8px" }}>
                  <small style={{ color: "var(--muted)" }}>Pending Applications</small>
                  <h3 style={{ margin: "5px 0" }}>{analytics.pendingApplications}</h3>
                </div>
                <div style={{ border: "1px solid var(--line)", padding: "15px", borderRadius: "8px" }}>
                  <small style={{ color: "var(--muted)" }}>Total Booth Spaces</small>
                  <h3 style={{ margin: "5px 0" }}>{analytics.totalBooths} ({analytics.occupiedBooths} Occupied)</h3>
                </div>
                <div style={{ border: "1px solid var(--line)", padding: "15px", borderRadius: "8px" }}>
                  <small style={{ color: "var(--muted)" }}>Session Registrations</small>
                  <h3 style={{ margin: "5px 0" }}>{analytics.session_registrations}</h3>
                </div>
              </div>
            </div>

            <div className="data-table-card">
              <h3>Recent Expos Status</h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expos.map((e) => (
                      <tr key={e._id}>
                        <td><strong>{e.title}</strong></td>
                        <td>{e.date}</td>
                        <td>{e.location}, {e.city}</td>
                        <td>{e.category}</td>
                        <td><span className="badge badge-approved">{e.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXPO MANAGEMENT TAB */}
        {activeTab === "expos" && (
          <div>
            {showExpoModal && (
              <form className="form-card" onSubmit={handleSaveExpo} style={{ marginBottom: "30px" }}>
                <h3>{editingExpoId ? "Edit Expo Event" : "Create New Expo Event"}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <label>Title<input required value={expoForm.title} onChange={(e) => setExpoForm({ ...expoForm, title: e.target.value })} placeholder="e.g. Tech Future Expo 2026" /></label>
                  <label>Category<select value={expoForm.category} onChange={(e) => setExpoForm({ ...expoForm, category: e.target.value })}><option>Technology</option><option>Healthcare</option><option>Design</option><option>Business</option><option>Education</option></select></label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                  <label>Date<input required type="date" value={expoForm.date} onChange={(e) => setExpoForm({ ...expoForm, date: e.target.value })} /></label>
                  <label>Start Time<input value={expoForm.start_time} onChange={(e) => setExpoForm({ ...expoForm, start_time: e.target.value })} placeholder="09:00 AM" /></label>
                  <label>End Time<input value={expoForm.end_time} onChange={(e) => setExpoForm({ ...expoForm, end_time: e.target.value })} placeholder="05:00 PM" /></label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <label>Location / Venue<input required value={expoForm.location} onChange={(e) => setExpoForm({ ...expoForm, location: e.target.value })} placeholder="Expo Centre" /></label>
                  <label>City<input required value={expoForm.city} onChange={(e) => setExpoForm({ ...expoForm, city: e.target.value })} placeholder="Karachi / Lahore / Islamabad" /></label>
                </div>
                <label>Theme / Key Focus<input required value={expoForm.theme} onChange={(e) => setExpoForm({ ...expoForm, theme: e.target.value })} placeholder="Theme description" /></label>
                <label>Banner Image URL<input value={expoForm.banner_url} onChange={(e) => setExpoForm({ ...expoForm, banner_url: e.target.value })} placeholder="https://..." /></label>
                <label>Description<textarea required rows="3" value={expoForm.description} onChange={(e) => setExpoForm({ ...expoForm, description: e.target.value })} placeholder="Event details..." /></label>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button type="submit" className="btn"><Plus size={16} /> Save Expo</button>
                  <button type="button" className="btn btn-light" onClick={() => setShowExpoModal(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="data-table-card">
              <h3>All Expos ({expos.length})</h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expos.map((e) => (
                      <tr key={e._id}>
                        <td><strong>{e.title}</strong></td>
                        <td>{e.category}</td>
                        <td>{e.date}</td>
                        <td>{e.location}, {e.city}</td>
                        <td><span className="badge badge-approved">{e.status}</span></td>
                        <td>
                          <button className="btn btn-small btn-light" style={{ marginRight: "6px" }} onClick={() => handleEditExpo(e)} title="Edit Expo"><Edit size={14} /></button>
                          <button className="btn btn-small" style={{ background: "#ff4d4f", color: "#fff", border: 0 }} onClick={() => handleDeleteExpo(e._id)} title="Delete Expo"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. EXHIBITOR MANAGEMENT (APPLICATIONS) TAB */}
        {activeTab === "applications" && (
          <div className="data-table-card">
            <h3>Exhibitor Applications & Approval Workflow ({applications.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Category</th>
                    <th>Expo</th>
                    <th>Preferred Booth</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: "center" }}>No exhibitor applications received yet.</td></tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id}>
                        <td><strong>{app.company_name}</strong><br /><small>{app.contact_email}</small></td>
                        <td>{app.category}</td>
                        <td>{app.expo_id?.title || "Tech Future Expo"}</td>
                        <td>{app.assigned_booth || app.preferred_booth || "A01"}</td>
                        <td>
                          <span className={`badge ${app.status === "approved" ? "badge-approved" : app.status === "rejected" ? "badge-rejected" : "badge-upcoming"}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === "pending" ? (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button className="btn btn-small" style={{ background: "#28a745" }} onClick={() => handleUpdateAppStatus(app._id, "approved", app.preferred_booth)}>
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button className="btn btn-small" style={{ background: "#dc3545" }} onClick={() => handleUpdateAppStatus(app._id, "rejected")}>
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <small style={{ color: "var(--muted)" }}>Completed</small>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. BOOTH MANAGEMENT TAB */}
        {activeTab === "booths" && (
          <div>
            <form className="form-card" onSubmit={handleAllocateBooth} style={{ marginBottom: "25px" }}>
              <h3>Create / Assign Booth Space</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                <label>Booth Number<input required value={newBooth.booth_number} onChange={(e) => setNewBooth({ ...newBooth, booth_number: e.target.value })} placeholder="e.g. A05" /></label>
                <label>Size<select value={newBooth.size} onChange={(e) => setNewBooth({ ...newBooth, size: e.target.value })}><option>Standard (10x10)</option><option>Premium (15x15)</option><option>Large (20x20)</option><option>Corner Suite (15x20)</option></select></label>
                <label>Location<input value={newBooth.location} onChange={(e) => setNewBooth({ ...newBooth, location: e.target.value })} placeholder="Main Hall" /></label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <label>Status<select value={newBooth.status} onChange={(e) => setNewBooth({ ...newBooth, status: e.target.value })}><option value="available">Available</option><option value="occupied">Occupied</option><option value="reserved">Reserved / Special</option></select></label>
                <label>Assigned Exhibitor Name<input value={newBooth.exhibitor_name} onChange={(e) => setNewBooth({ ...newBooth, exhibitor_name: e.target.value })} placeholder="Company Name" /></label>
              </div>
              <button className="btn" type="submit"><Plus size={16} /> Save Booth Allocation</button>
            </form>

            <div className="data-table-card">
              <h3>Current Floor Plan Booths ({booths.length})</h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Booth Number</th>
                      <th>Size</th>
                      <th>Location</th>
                      <th>Exhibitor Assigned</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booths.map((b) => (
                      <tr key={b._id || b.booth_number}>
                        <td><strong>{b.booth_number}</strong></td>
                        <td>{b.size}</td>
                        <td>{b.location}</td>
                        <td>{b.exhibitor_name || "Unassigned"}</td>
                        <td><span className={`badge ${b.status === "occupied" ? "badge-approved" : "badge-upcoming"}`}>{b.status}</span></td>
                        <td>
                          {b._id && (
                            <button className="btn btn-small" style={{ background: "#ff4d4f", color: "#fff", border: 0 }} onClick={() => handleDeleteBooth(b._id)}><Trash2 size={14} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. SCHEDULE MANAGEMENT (SESSIONS) TAB */}
        {activeTab === "sessions" && (
          <div>
            {showSessionModal && (
              <form className="form-card" onSubmit={handleSaveSession} style={{ marginBottom: "30px" }}>
                <h3>{editingSessionId ? "Edit Session" : "Create Session / Workshop"}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                  <label>Expo Event<select value={sessionForm.expo_id} onChange={(e) => setSessionForm({ ...sessionForm, expo_id: e.target.value })}><option value="">All Expos</option>{expos.map(x => <option key={x._id} value={x._id}>{x.title}</option>)}</select></label>
                  <label>Day<select value={sessionForm.day} onChange={(e) => setSessionForm({ ...sessionForm, day: e.target.value })}><option>Day 1</option><option>Day 2</option><option>Day 3</option></select></label>
                  <label>Time Slot<input required value={sessionForm.time} onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })} placeholder="10:00 AM" /></label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <label>Session Title<input required value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} placeholder="Keynote: AI Future" /></label>
                  <label>Speaker Name & Role<input required value={sessionForm.speaker} onChange={(e) => setSessionForm({ ...sessionForm, speaker: e.target.value })} placeholder="Dr. John Doe" /></label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <label>Stage / Room Location<input value={sessionForm.location} onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })} placeholder="Main Stage" /></label>
                  <label>Category Tag<select value={sessionForm.tag} onChange={(e) => setSessionForm({ ...sessionForm, tag: e.target.value })}><option>Keynote</option><option>Workshop</option><option>Panel</option><option>Talk</option></select></label>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button className="btn" type="submit"><Plus size={16} /> Save Session</button>
                  <button type="button" className="btn btn-light" onClick={() => setShowSessionModal(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="data-table-card">
              <h3>All Scheduled Sessions ({sessions.length})</h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Day & Time</th>
                      <th>Title</th>
                      <th>Speaker</th>
                      <th>Location</th>
                      <th>Tag</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s._id}>
                        <td>{s.day} · {s.time}</td>
                        <td><strong>{s.title}</strong></td>
                        <td>{s.speaker}</td>
                        <td>{s.location}</td>
                        <td><span className="badge badge-approved">{s.tag}</span></td>
                        <td>
                          <button className="btn btn-small btn-light" style={{ marginRight: "6px" }} onClick={() => handleEditSession(s)}><Edit size={14} /></button>
                          <button className="btn btn-small" style={{ background: "#ff4d4f", color: "#fff", border: 0 }} onClick={() => handleDeleteSession(s._id)}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. ATTENDEE MANAGEMENT TAB */}
        {activeTab === "registrations" && (
          <div className="data-table-card">
            <h3>Registered Attendees & Passes ({registrationsList.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Attendee Name</th>
                    <th>Email</th>
                    <th>Expo Event</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrationsList.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center" }}>No attendee registrations yet.</td></tr>
                  ) : (
                    registrationsList.map((r) => (
                      <tr key={r._id}>
                        <td><strong>{r.attendee_id?.name || "Attendee"}</strong></td>
                        <td>{r.attendee_id?.email || "email@domain.com"}</td>
                        <td>{r.expo_id?.title || "Tech Future Expo"}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td><span className="badge badge-approved">{r.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="data-table-card">
            <h3>Exhibitor & Attendee Messages ({messagesList.length})</h3>
            {messagesList.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No messages received.</p>
            ) : (
              <div>
                {messagesList.map((m) => (
                  <div key={m._id} style={{ borderBottom: "1px solid var(--line)", padding: "14px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: "0 0 4px", color: "var(--navy)" }}>{m.subject}</h4>
                      <small style={{ color: "var(--muted)" }}>{new Date(m.createdAt).toLocaleString()}</small>
                    </div>
                    <p style={{ margin: "4px 0", fontSize: "14px" }}>{m.message}</p>
                    <small style={{ color: "var(--blue2)" }}>From: {m.sender_name} ({m.sender_email})</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <form className="form-card" onSubmit={handleSendNotification} style={{ maxWidth: "600px" }}>
            <h3><Bell color="var(--yellow)" /> Broadcast Event Notification</h3>
            <label>Recipient User
              <select value={notifForm.user_id} onChange={(e) => setNotifForm({ ...notifForm, user_id: e.target.value })}>
                <option value="">Select Recipient User</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role} - {u.email})</option>
                ))}
              </select>
            </label>
            <label>Notification Type
              <select value={notifForm.type} onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })}>
                <option value="info">Info Announcement</option>
                <option value="reminder">Session Reminder</option>
                <option value="booth_update">Booth Update</option>
                <option value="system">System Alert</option>
              </select>
            </label>
            <label>Title
              <input required value={notifForm.title} onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })} placeholder="e.g. Schedule Update Announcement" />
            </label>
            <label>Message Content
              <textarea required rows="4" value={notifForm.message} onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })} placeholder="Enter message details..." />
            </label>
            <button className="btn full" type="submit"><Send size={16} /> Push Notification</button>
          </form>
        )}

        {/* 9. FEEDBACK TAB */}
        {activeTab === "feedback" && (
          <div className="data-table-card">
            <h3>Feedback & Ratings ({feedbackList.length})</h3>
            {feedbackList.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No user feedback recorded yet.</p>
            ) : (
              <div>
                {feedbackList.map((f) => (
                  <div key={f._id} style={{ borderBottom: "1px solid var(--line)", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ color: "gold", fontSize: "14px", marginBottom: "4px" }}>
                        {"★".repeat(f.rating || 5)}{"☆".repeat(5 - (f.rating || 5))}
                      </div>
                      <h4 style={{ margin: "0 0 4px" }}>{f.subject}</h4>
                      <p style={{ margin: "0 0 4px", fontSize: "14px" }}>{f.message}</p>
                      <small style={{ color: "var(--muted)" }}>By {f.name} ({f.email}) · {new Date(f.createdAt).toLocaleDateString()}</small>
                    </div>
                    <button className="btn btn-small" style={{ background: "#ff4d4f", color: "#fff" }} onClick={() => handleDeleteFeedback(f._id)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 10. USER DIRECTORY TAB */}
        {activeTab === "users" && (
          <div className="data-table-card">
            <h3>All Registered Platform Users ({users.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Company / Org</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-approved">{u.role}</span></td>
                      <td>{u.company || "N/A"}</td>
                      <td>{u.phone || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 11. PROFILE / SETTINGS TAB */}
        {activeTab === "settings" && (
          <form className="form-card" onSubmit={handleUpdateProfile} style={{ maxWidth: "600px" }}>
            <h3><User color="var(--blue2)" /> Profile & Password Settings</h3>
            <label>Admin Full Name
              <input required value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
            </label>
            <label>Organization / Company
              <input value={profileForm.company} onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })} />
            </label>
            <label>Phone Number
              <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+92 300 0000000" />
            </label>
            <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid var(--line)" }} />
            <h4>Change Password</h4>
            <label>New Password
              <input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} placeholder="Leave blank to keep unchanged" />
            </label>
            <label>Confirm New Password
              <input type="password" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} placeholder="Confirm password" />
            </label>
            <button className="btn full" type="submit">Save Profile Settings</button>
          </form>
        )}
      </main>
    </div>
  );
}
