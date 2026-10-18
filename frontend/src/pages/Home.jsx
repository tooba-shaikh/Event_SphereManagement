import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Users, Search, Map, Heart } from "lucide-react";
import api from "../api";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span></span> Events that move ideas forward</div>
          <h1>Discover. Connect.<br /><em>Experience more.</em></h1>
          <p>Explore standout expos, meet inspiring exhibitors and build a schedule that makes every event worth your time.</p>
          <div className="hero-buttons">
            <Link className="btn" to="/expos">Explore Expos <ArrowRight size={18} /></Link>
            <Link className="btn btn-light" to="/register">Create Free Account</Link>
          </div>
          <div className="trust-row">
            <div><strong>50+</strong><span>Expos</span></div>
            <div><strong>300+</strong><span>Exhibitors</span></div>
            <div><strong>12K+</strong><span>Attendees</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85" alt="Professional expo" />
          <div className="floating-card fc1">
            <CalendarDays />
            <div><small>Next event</small><strong>15 October</strong></div>
          </div>
          <div className="floating-card fc2">
            <Users />
            <div><small>Community</small><strong>12K+ attendees</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExpoCard({ e }) {
  return (
    <article className="expo-card">
      <Link to={`/expos/${e._id || e.id}`} className="card-img">
        <img src={e.banner_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"} alt={e.title} />
        <span className="category">{e.category || "Expo"}</span>
        <button className="heart" aria-label="Save"><Heart size={18} /></button>
      </Link>
      <div className="card-body">
        <h3><Link to={`/expos/${e._id || e.id}`}>{e.title}</Link></h3>
        <p>{e.description}</p>
        <div className="meta">
          <span><CalendarDays />{e.date}</span>
          <span><MapPin />{e.city || e.location}</span>
        </div>
        <Link className="text-link" to={`/expos/${e._id || e.id}`}>View expo <ArrowRight /></Link>
      </div>
    </article>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">
      <span>{icon}</span>
      <div><h3>{title}</h3><p>{text}</p></div>
    </div>
  );
}

export default function Home() {
  const [expos, setExpos] = useState([]);

  useEffect(() => {
    api.get("/expos")
      .then((res) => setExpos(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Hero />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="kicker">UPCOMING EXPERIENCES</span>
              <h2>Find your next event</h2>
              <p>Curated expos where ideas, people and opportunities come together.</p>
            </div>
            <Link className="text-link" to="/expos">View all expos <ArrowRight /></Link>
          </div>
          <div className="cards">
            {expos.slice(0, 3).map((e) => (
              <ExpoCard key={e._id || e.id} e={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="container feature-grid">
          <div>
            <span className="kicker yellow">WHY EVENTSPHERE</span>
            <h2>Everything you need for a better expo experience.</h2>
            <p>Less searching. More discovering, connecting and participating.</p>
            <Link className="btn btn-yellow" to="/register">Get started <ArrowRight /></Link>
          </div>
          <div className="feature-list">
            <Feature icon={<Search />} title="Discover smarter" text="Browse events and exhibitors that match your interests." />
            <Feature icon={<CalendarDays />} title="Plan your day" text="See sessions and build a schedule before you arrive." />
            <Feature icon={<Map />} title="Navigate easily" text="Use the floor plan to find booths and key event spaces." />
            <Feature icon={<Users />} title="Make connections" text="Find exhibitors and opportunities worth remembering." />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta">
          <div>
            <span className="kicker">READY WHEN YOU ARE</span>
            <h2>Your next great connection starts here.</h2>
            <p>Create your EventSphere account and make every expo easier to explore.</p>
          </div>
          <Link className="btn btn-yellow" to="/register">Join EventSphere <ArrowRight /></Link>
        </div>
      </section>
    </>
  );
}
