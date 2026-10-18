import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, MapPin, Clock3, CheckCircle2, Ticket } from "lucide-react";
import api from "../api";

export default function ExpoDetails({ currentUser }) {
  const { id } = useParams();
  const [expoData, setExpoData] = useState(null);
  const [regMsg, setRegMsg] = useState("");

  useEffect(() => {
    api.get(`/expos/${id}`)
      .then((res) => setExpoData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!expoData || !expoData.expo) return <div className="container section empty">Loading Expo details...</div>;

  const { expo, sessions } = expoData;

  const handleRegisterExpo = async () => {
    if (!currentUser) {
      alert("Please sign in to register for this expo.");
      return;
    }
    try {
      const res = await api.post("/attendee-registrations", {
        attendee_id: currentUser.user?.id,
        expo_id: expo._id
      });
      setRegMsg(res.data.message);
    } catch (err) {
      setRegMsg("Registration error.");
    }
  };

  return (
    <>
      <section className="detail-hero">
        <img src={expo.banner_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"} alt={expo.title} />
        <div className="overlay"></div>
        <div className="container detail-content">
          <span className="category static">{expo.category || "General"}</span>
          <h1>{expo.title}</h1>
          <p>{expo.description}</p>
          <div className="detail-meta">
            <span><CalendarDays />{expo.date}</span>
            <span><MapPin />{expo.location}, {expo.city}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div>
            <h2>About this expo</h2>
            <p className="lead">{expo.theme}</p>
            <p>{expo.description}</p>

            <h2>Sessions & Schedule</h2>
            {sessions && sessions.length > 0 ? (
              <div style={{ margin: "20px 0" }}>
                {sessions.map((s) => (
                  <div key={s._id} className="session" style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
                    <div className="session-time"><Clock3 size={16} />{s.time}</div>
                    <div>
                      <span className="session-tag">{s.tag}</span>
                      <h4 style={{ margin: "4px 0" }}>{s.title}</h4>
                      <p style={{ fontSize: "12px", color: "var(--muted)" }}>{s.speaker} ({s.location})</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>Schedule sessions will be announced soon.</p>
            )}

            <h2>Event Highlights</h2>
            <div className="checks">
              <span><CheckCircle2 />Expert sessions & keynotes</span>
              <span><CheckCircle2 />Exhibition booths</span>
              <span><CheckCircle2 />Networking opportunities</span>
              <span><CheckCircle2 />Product showcases</span>
            </div>
          </div>

          <aside className="booking-card">
            <h3>Attend this expo</h3>
            <p>Save your place and keep event details together.</p>
            {regMsg && <div className="success" style={{ marginBottom: "15px" }}>{regMsg}</div>}
            <button className="btn full" onClick={handleRegisterExpo}><Ticket /> Register now</button>
            <Link className="outline-btn full" to="/schedule"><CalendarDays /> View full schedule</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
