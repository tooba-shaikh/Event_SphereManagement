import React, { useState, useEffect } from "react";
import api from "./api";
import { Building2, Plus, Send, CheckCircle2, Ticket,CalendarDays , MapPin, Package, Bell, Trash2, Mail, Layout, Clock, User, Lock, Edit, Eye } from "lucide-react";

export default function ExhibitorPortal() {
  const currentUser = JSON.parse(localStorage.getItem("eventsphere_user") || "{}");
  const userId = currentUser.user?.id;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [exhibitorData, setExhibitorData] = useState(null);
  const [profile, setProfile] = useState({
    company_name: currentUser.user?.company || currentUser.user?.name || "",
    description: "",
    category: "AI & Software",
    contact_email: currentUser.user?.email || "",
    contact_phone: currentUser.user?.phone || "",
    website: "",
    logo_url: ""
  });

  const [expos, setExpos] = useState([]);
  const [booths, setBooths] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Application state
  const [selectedExpo, setSelectedExpo] = useState("");
  const [preferredBooth, setPreferredBooth] = useState("A01");
  const [appDescription, setAppDescription] = useState("");
  const [appProducts, setAppProducts] = useState("");

  // Product addition state
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", image_url: "" });

  // Inquiry state
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  // Settings state
  const [settingsForm, setSettingsForm] = useState({ name: currentUser.user?.name || "", phone: currentUser.user?.phone || "", password: "", confirmPassword: "" });

  const [msgStatus, setMsgStatus] = useState("");

  const fetchData = async () => {
    try {
      const [exposRes, appsRes, notifRes, msgsRes, exhibsRes, boothsRes] = await Promise.all([
        api.get("/expos"),
        api.get(`/applications?exhibitor_id=${userId}`),
        api.get(`/notifications?user_id=${userId}`),
        api.get(`/messages?user_id=${userId}`),
        api.get(`/exhibitors?user_id=${userId}`),
        api.get("/booths")
      ]);

      setExpos(exposRes.data);
      setBooths(boothsRes.data);
      if (exposRes.data.length > 0 && !selectedExpo) {
        setSelectedExpo(exposRes.data[0]._id);
      }
      setApplications(appsRes.data);
      setNotifications(notifRes.data);
      setMessages(msgsRes.data);

      if (exhibsRes.data && exhibsRes.data.length > 0) {
        const ex = exhibsRes.data[0];
        setExhibitorData(ex);
        setProfile({
          company_name: ex.company_name || currentUser.user?.company || "",
          description: ex.description || "",
          category: ex.category || "AI & Software",
          contact_email: ex.contact_email || currentUser.user?.email || "",
          contact_phone: ex.contact_phone || currentUser.user?.phone || "",
          website: ex.website || "",
          logo_url: ex.logo || ""
        });
      }
    } catch (err) {
      console.error("Exhibitor portal fetch error:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exhibitors/profile", {
        user_id: userId,
        ...profile
      });
      setMsgStatus("Company profile updated successfully!");
      fetchData();
    } catch (err) {
      setMsgStatus("Failed to update profile.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exhibitors/products", {
        user_id: userId,
        ...newProduct
      });
      setMsgStatus("Product added to showcase!");
      setNewProduct({ name: "", description: "", price: "", image_url: "" });
      fetchData();
    } catch (err) {
      setMsgStatus("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (index) => {
    try {
      await api.delete(`/exhibitors/products/${index}?user_id=${userId}`);
      setMsgStatus("Product deleted from showcase!");
      fetchData();
    } catch (err) {
      setMsgStatus("Failed to delete product.");
    }
  };

  const handleApplyExpo = async (e) => {
    e.preventDefault();
    try {
      await api.post("/applications", {
        exhibitor_id: userId,
        expo_id: selectedExpo,
        company_name: profile.company_name,
        category: profile.category,
        description: appDescription || profile.description,
        products: appProducts,
        contact_email: profile.contact_email,
        contact_phone: profile.contact_phone,
        preferred_booth: preferredBooth
      });
      setMsgStatus("Exhibitor application submitted to organizers!");
      setAppDescription("");
      setAppProducts("");
      fetchData();
    } catch (err) {
      setMsgStatus("Failed to submit application.");
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post("/messages", {
        sender_id: userId,
        sender_name: profile.company_name || currentUser.user?.name,
        sender_email: profile.contact_email || currentUser.user?.email,
        subject: inquirySubject,
        message: inquiryMessage
      });
      setMsgStatus("Inquiry message sent to organizers!");
      setInquirySubject("");
      setInquiryMessage("");
      fetchData();
    } catch (err) {
      setMsgStatus("Failed to send inquiry.");
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/profile", {
        user_id: userId,
        name: settingsForm.name,
        phone: settingsForm.phone,
        company: profile.company_name
      });
      setMsgStatus("Settings updated successfully!");
    } catch (err) {
      setMsgStatus("Failed to update settings.");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-item active-title" style={{ color: "var(--navy)", fontSize: "16px", marginBottom: "15px" }}>
          <Building2 size={20} color="var(--yellow)" /> <strong>Exhibitor Portal</strong>
        </div>
        <div className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          <Layout size={18} /> Exhibitor Dashboard
        </div>
        <div className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          <Building2 size={18} /> Company Profile
        </div>
        <div className={`sidebar-item ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
          <Package size={18} /> Products & Services
        </div>
        <div className={`sidebar-item ${activeTab === "apply" ? "active" : ""}`} onClick={() => setActiveTab("apply")}>
          <Ticket size={18} /> Apply for Expo
        </div>
        <div className={`sidebar-item ${activeTab === "my-apps" ? "active" : ""}`} onClick={() => setActiveTab("my-apps")}>
          <CheckCircle2 size={18} /> My Applications ({applications.length})
        </div>
        <div className={`sidebar-item ${activeTab === "booth-selection" ? "active" : ""}`} onClick={() => setActiveTab("booth-selection")}>
          <Layout size={18} /> Booth Selection
        </div>
        <div className={`sidebar-item ${activeTab === "my-booth" ? "active" : ""}`} onClick={() => setActiveTab("my-booth")}>
          <MapPin size={18} /> My Booth Details
        </div>
        <div className={`sidebar-item ${activeTab === "messages" ? "active" : ""}`} onClick={() => setActiveTab("messages")}>
          <Send size={18} /> Messages
        </div>
        <div className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
          <Bell size={18} /> Notifications ({notifications.length})
        </div>
        <div className={`sidebar-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
          <User size={18} /> Account Settings
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="dash-header">
          <div>
            <h2>Exhibitor Control Hub</h2>
            <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>Welcome, {profile.company_name || "Exhibitor"}! Manage applications, booths, products and organizer messaging.</p>
          </div>
        </div>

        {msgStatus && <div className="success" style={{ marginBottom: "25px" }}>{msgStatus}</div>}

        {/* 1. EXHIBITOR DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Ticket /></div>
                <div className="metric-info">
                  <strong>{applications.length}</strong>
                  <span>Submitted Applications</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><MapPin /></div>
                <div className="metric-info">
                  <strong>{exhibitorData?.booth || "A01"}</strong>
                  <span>Assigned Booth</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><Package /></div>
                <div className="metric-info">
                  <strong>{exhibitorData?.products?.length || 0}</strong>
                  <span>Showcase Products</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><CalendarDays /></div>
                <div className="metric-info">
                  <strong>{expos.length}</strong>
                  <span>Upcoming Expos</span>
                </div>
              </div>
            </div>

            <div className="data-table-card">
              <h3>Recent Applications & Booth Allocation Overview</h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Expo Event</th>
                      <th>Category</th>
                      <th>Assigned Booth</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(a => (
                      <tr key={a._id}>
                        <td><strong>{a.expo_id?.title || "Tech Future Expo 2026"}</strong></td>
                        <td>{a.category}</td>
                        <td><strong>{a.assigned_booth || a.preferred_booth || "A01"}</strong></td>
                        <td><span className={`badge ${a.status === 'approved' ? 'badge-approved' : 'badge-upcoming'}`}>{a.status.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMPANY PROFILE TAB */}
        {activeTab === "profile" && (
          <form className="form-card" onSubmit={handleUpdateProfile} style={{ maxWidth: "700px" }}>
            <h3><Building2 color="var(--blue2)" /> Update Company Profile</h3>
            <label>Company / Brand Name
              <input required value={profile.company_name} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} placeholder="NovaTech Labs" />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <label>Industry Category
                <select value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })}>
                  <option>AI & Software</option>
                  <option>Design & Media</option>
                  <option>EdTech</option>
                  <option>Clean Tech</option>
                  <option>FinTech</option>
                  <option>HealthTech</option>
                </select>
              </label>
              <label>Website URL
                <input value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="https://company.com" />
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <label>Contact Email
                <input required type="email" value={profile.contact_email} onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })} />
              </label>
              <label>Contact Phone
                <input value={profile.contact_phone} onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })} placeholder="+92 300 1234567" />
              </label>
            </div>
            <label>Logo Image URL
              <input value={profile.logo_url} onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })} placeholder="https://..." />
            </label>
            <label>Company Description
              <textarea rows="4" value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} placeholder="Brief summary of products & services..." />
            </label>
            <button className="btn full" type="submit">Save Profile Changes</button>
          </form>
        )}

        {/* 3. PRODUCTS & SERVICES TAB */}
        {activeTab === "products" && (
          <div>
            <form className="form-card" onSubmit={handleAddProduct} style={{ marginBottom: "30px", maxWidth: "700px" }}>
              <h3><Package color="var(--blue2)" /> Add Showcase Product / Service</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <label>Product Name<input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. AI Automation Engine" /></label>
                <label>Price ($)<input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="1999" /></label>
              </div>
              <label>Product Image URL<input value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="https://..." /></label>
              <label>Description<textarea rows="3" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Key features of product..." /></label>
              <button className="btn" type="submit"><Plus size={16} /> Add Product</button>
            </form>

            <div className="data-table-card">
              <h3>Current Products Showcase ({exhibitorData?.products?.length || 0})</h3>
              {(!exhibitorData?.products || exhibitorData.products.length === 0) ? (
                <p style={{ color: "var(--muted)" }}>No products added yet. Use the form above to add your showcase items!</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
                  {exhibitorData.products.map((p, idx) => (
                    <div key={idx} style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "15px", background: "#fff" }}>
                      {p.image && <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }} />}
                      <h4 style={{ margin: "0 0 5px" }}>{p.name}</h4>
                      <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 10px" }}>{p.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "var(--navy)" }}>${p.price}</strong>
                        <button className="btn btn-small" style={{ background: "#ff4d4f", color: "#fff" }} onClick={() => handleDeleteProduct(idx)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. APPLY FOR EXPO TAB */}
        {activeTab === "apply" && (
          <form className="form-card" onSubmit={handleApplyExpo} style={{ maxWidth: "700px" }}>
            <h3><Ticket color="var(--blue2)" /> Submit Expo Application</h3>
            <label>Select Target Expo Event
              <select value={selectedExpo} onChange={(e) => setSelectedExpo(e.target.value)}>
                {expos.map((ex) => (
                  <option key={ex._id} value={ex._id}>{ex.title} ({ex.location}, {ex.city})</option>
                ))}
              </select>
            </label>
            <label>Preferred Booth Allocation
              <select value={preferredBooth} onChange={(e) => setPreferredBooth(e.target.value)}>
                <option value="A01">Booth A01 (Main Entrance)</option>
                <option value="A02">Booth A02 (Tech Hall)</option>
                <option value="B01">Booth B01 (Center Aisle)</option>
                <option value="C01">Booth C01 (Corner Suite)</option>
                <option value="D01">Booth D01 (Standard)</option>
              </select>
            </label>
            <label>Products / Services to Showcase
              <input value={appProducts} onChange={(e) => setAppProducts(e.target.value)} placeholder="e.g. AI Platforms, Cloud Tools" />
            </label>
            <label>Special Requirements & Notes
              <textarea rows="3" value={appDescription} onChange={(e) => setAppDescription(e.target.value)} placeholder="Power supply requirements, display setups, audio..." />
            </label>
            <button className="btn btn-yellow full" type="submit">Submit Application to Organizers</button>
          </form>
        )}

        {/* 5. MY APPLICATIONS TAB */}
        {activeTab === "my-apps" && (
          <div className="data-table-card">
            <h3>My Application Statuses ({applications.length})</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Expo Event</th>
                    <th>Category</th>
                    <th>Preferred Booth</th>
                    <th>Assigned Booth</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: "center" }}>No applications submitted yet.</td></tr>
                  ) : (
                    applications.map((a) => (
                      <tr key={a._id}>
                        <td><strong>{a.expo_id?.title || "Tech Future Expo"}</strong></td>
                        <td>{a.category}</td>
                        <td>{a.preferred_booth || "A01"}</td>
                        <td><strong>{a.assigned_booth || "Pending Allocation"}</strong></td>
                        <td>
                          <span className={`badge ${a.status === "approved" ? "badge-approved" : a.status === "rejected" ? "badge-rejected" : "badge-upcoming"}`}>
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. BOOTH SELECTION TAB */}
        {activeTab === "booth-selection" && (
          <div className="data-table-card">
            <h3>Available Booth Locations on Floor Plan</h3>
            <p style={{ color: "var(--muted)" }}>Select your preferred booth when filling out an expo application.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", marginTop: "15px" }}>
              {booths.map((b) => (
                <div key={b._id || b.booth_number} style={{ border: "1px solid var(--line)", padding: "15px", borderRadius: "8px", background: b.status === 'occupied' ? '#eef4ff' : '#fff' }}>
                  <h4 style={{ margin: "0 0 4px" }}>Booth {b.booth_number}</h4>
                  <small style={{ display: "block", color: "var(--muted)" }}>{b.size}</small>
                  <small style={{ display: "block", color: "var(--muted)", marginBottom: "8px" }}>{b.location}</small>
                  <span className={`badge ${b.status === 'occupied' ? 'badge-approved' : 'badge-upcoming'}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. MY BOOTH DETAILS TAB */}
        {activeTab === "my-booth" && (
          <div className="form-card" style={{ maxWidth: "700px" }}>
            <h3><MapPin color="var(--blue2)" /> Assigned Booth Details</h3>
            <p><strong>Company:</strong> {profile.company_name}</p>
            <p><strong>Assigned Booth Number:</strong> <span className="badge badge-approved" style={{ fontSize: "16px" }}>{exhibitorData?.booth || "A01"}</span></p>
            <p><strong>Expo Event:</strong> {expos.find(x => x._id === exhibitorData?.expo_id)?.title || "Tech Future Expo 2026"}</p>
            <p><strong>Status:</strong> Active & Confirmed</p>
          </div>
        )}

        {/* 8. MESSAGES & ORGANIZER INQUIRY TAB */}
        {activeTab === "messages" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
            <form className="form-card" onSubmit={handleSendInquiry}>
              <h3><Send color="var(--blue2)" /> Contact Event Organizers</h3>
              <label>Subject
                <input required value={inquirySubject} onChange={(e) => setInquirySubject(e.target.value)} placeholder="Inquiry about booth placement or power" />
              </label>
              <label>Message
                <textarea required rows="4" value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} placeholder="Write message to organizers..." />
              </label>
              <button className="btn full" type="submit">Send Message</button>
            </form>

            <div className="data-table-card">
              <h3>Message History ({messages.length})</h3>
              {messages.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>No previous messages.</p>
              ) : (
                messages.map((m) => (
                  <div key={m._id} style={{ borderBottom: "1px solid var(--line)", padding: "10px 0" }}>
                    <h4 style={{ margin: "0 0 4px" }}>{m.subject}</h4>
                    <p style={{ margin: 0, fontSize: "13px" }}>{m.message}</p>
                    <small style={{ color: "var(--muted)" }}>{new Date(m.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 9. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="data-table-card">
            <h3>Exhibitor Notifications & Alerts</h3>
            {notifications.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No notifications available.</p>
            ) : (
              notifications.map((n) => (
                <div key={n._id} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
                  <h4 style={{ margin: "0 0 4px", color: "var(--navy)" }}>{n.title}</h4>
                  <p style={{ margin: 0, fontSize: "14px" }}>{n.message}</p>
                  <small style={{ color: "var(--muted)" }}>{new Date(n.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        )}

        {/* 10. SETTINGS & PASSWORD TAB */}
        {activeTab === "settings" && (
          <form className="form-card" onSubmit={handleUpdateSettings} style={{ maxWidth: "600px" }}>
            <h3><User color="var(--blue2)" /> Account & Security Settings</h3>
            <label>Contact Person Name
              <input required value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} />
            </label>
            <label>Phone Number
              <input value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
            </label>
            <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid var(--line)" }} />
            <h4>Change Account Password</h4>
            <label>New Password
              <input type="password" value={settingsForm.password} onChange={(e) => setSettingsForm({ ...settingsForm, password: e.target.value })} placeholder="New password" />
            </label>
            <label>Confirm New Password
              <input type="password" value={settingsForm.confirmPassword} onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })} placeholder="Confirm password" />
            </label>
            <button className="btn full" type="submit">Save Account Settings</button>
          </form>
        )}
      </main>
    </div>
  );
}
