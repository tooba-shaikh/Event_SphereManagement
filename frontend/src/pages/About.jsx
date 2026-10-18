import React from "react";
import { PageHero } from "./Expos";

export default function About() {
  return (
    <>
      <PageHero kicker="ABOUT EVENTSPHERE" title="Better events begin with better connections." text="EventSphere makes expos easier to discover, navigate and enjoy." />
      <section className="section">
        <div className="container about-grid">
          <div>
            <h2>Built around the event experience</h2>
            <p className="lead">We bring event discovery, exhibitors, schedules and navigation into one clean experience.</p>
            <p>Whether you are attending, exhibiting or simply exploring, EventSphere is designed to reduce friction and help you focus on what matters: people, ideas and opportunities.</p>
          </div>
          <div className="about-stats">
            <div><strong>50+</strong><span>Events</span></div>
            <div><strong>300+</strong><span>Exhibitors</span></div>
            <div><strong>12K+</strong><span>Attendees</span></div>
            <div><strong>6</strong><span>Industries</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
