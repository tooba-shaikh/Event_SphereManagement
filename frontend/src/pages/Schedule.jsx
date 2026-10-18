import React, { useState, useEffect } from "react";
import { Clock3, MapPin } from "lucide-react";
import api from "../api";
import { PageHero } from "./Expos";

export default function Schedule({ currentUser }) {
  const [sessions, setSessions] = useState([]);
  const [activeDay, setActiveDay] = useState("Day 1");
  const [bookmarkedMsg, setBookmarkedMsg] = useState("");

  useEffect(() => {
    api.get(`/sessions?day=${activeDay}`)
      .then((res) => setSessions(res.data))
      .catch((err) => console.log(err));
  }, [activeDay]);

  const handleBookmark = async (sessionId) => {
    if (!currentUser) {
      alert("Please sign in to bookmark sessions.");
      return;
    }
    try {
      await api.post("/session-registrations", {
        attendee_id: currentUser.user?.id,
        session_id: sessionId
      });
      setBookmarkedMsg("Session bookmarked in your schedule!");
      setTimeout(() => setBookmarkedMsg(""), 3000);
    } catch (err) {
      alert("Failed to bookmark session.");
    }
  };

  return (
    <>
      <PageHero kicker="PLAN YOUR DAY" title="Event schedule" text="Know what is happening, where it is happening and when to be there." />
      <section className="section">
        <div className="container schedule">
          {bookmarkedMsg && <div className="success" style={{ marginBottom: "20px" }}>{bookmarkedMsg}</div>}
          <div className="day-tabs">
            <button className={activeDay === "Day 1" ? "active" : ""} onClick={() => setActiveDay("Day 1")}>Day 1 · Oct 15</button>
            <button className={activeDay === "Day 2" ? "active" : ""} onClick={() => setActiveDay("Day 2")}>Day 2 · Oct 16</button>
            <button className={activeDay === "Day 3" ? "active" : ""} onClick={() => setActiveDay("Day 3")}>Day 3 · Oct 17</button>
          </div>
          {sessions.map((s) => (
            <div className="session" key={s._id || s.title}>
              <div className="session-time"><Clock3 />{s.time}</div>
              <div>
                <span className="session-tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p><MapPin size={16} />{s.speaker} ({s.location})</p>
              </div>
              <button className="save-session" onClick={() => handleBookmark(s._id)}>+ Bookmark</button>
            </div>
          ))}
          {!sessions.length && <div className="empty">No sessions scheduled for {activeDay}.</div>}
        </div>
      </section>
    </>
  );
}
