import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import api from "../api";
import { ExpoCard } from "./Home";

export function PageHero({ kicker, title, text }) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="kicker yellow">{kicker}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

export default function Expos() {
  const [expos, setExpos] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    api.get("/expos")
      .then((res) => setExpos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const cats = ["All", ...new Set(expos.map((x) => x.category).filter(Boolean))];

  const filtered = useMemo(
    () =>
      expos.filter(
        (e) =>
          (cat === "All" || e.category === cat) &&
          (e.title + " " + (e.city || "") + " " + (e.category || "")).toLowerCase().includes(q.toLowerCase())
      ),
    [expos, q, cat]
  );

  return (
    <>
      <PageHero kicker="EXPLORE" title="Upcoming expos" text="Find an experience worth showing up for." />
      <section className="section">
        <div className="container">
          <div className="filters">
            <div className="searchbox">
              <Search />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search expos, city or category" />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {cats.map((c) => (<option key={c}>{c}</option>))}
            </select>
          </div>
          <div className="cards">
            {filtered.map((e) => (<ExpoCard key={e._id || e.id} e={e} />))}
          </div>
          {!filtered.length && <div className="empty">No expos match your search.</div>}
        </div>
      </section>
    </>
  );
}
