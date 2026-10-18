import React, { useState, useEffect } from "react";
import { Search, ArrowRight, Package, X } from "lucide-react";
import api from "../api";
import { PageHero } from "./Expos";

export default function Exhibitors() {
  const [exhibitors, setExhibitors] = useState([]);
  const [q, setQ] = useState("");
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);

  useEffect(() => {
    api.get("/exhibitors")
      .then((res) => setExhibitors(res.data))
      .catch((err) => console.log(err));
  }, []);

  const list = exhibitors.filter((x) =>
    ((x.company_name || "") + " " + (x.category || "") + " " + (x.description || "")).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHero kicker="MEET THE BRANDS" title="Featured exhibitors" text="Discover companies, products and people across the expo floor." />
      <section className="section">
        <div className="container">
          <div className="searchbox wide">
            <Search />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exhibitors or industry" />
          </div>
          <div className="exhibitor-grid">
            {list.map((x) => (
              <div className="exhibitor" key={x._id || x.company_name}>
                <div className="brand-avatar">{x.company_name ? x.company_name[0].toUpperCase() : "E"}</div>
                <span className="booth">Booth {x.booth || "A01"}</span>
                <h3>{x.company_name}</h3>
                <strong>{x.category || "Exhibitor"}</strong>
                <p>{x.description || "Leading industry exhibitor showcasing innovative products."}</p>
                <button className="text-link" onClick={() => setSelectedExhibitor(x)}>View profile <ArrowRight /></button>
              </div>
            ))}
          </div>
          {!list.length && <div className="empty">No exhibitors match your query.</div>}
        </div>
      </section>

      {/* EXHIBITOR DETAILS MODAL */}
      {selectedExhibitor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
          <div className="form-card" style={{ maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setSelectedExhibitor(null)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: 0, cursor: "pointer" }}><X /></button>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
              <div className="brand-avatar" style={{ width: "50px", height: "50px", fontSize: "20px" }}>{selectedExhibitor.company_name[0]}</div>
              <div>
                <h2 style={{ margin: 0 }}>{selectedExhibitor.company_name}</h2>
                <span className="badge badge-approved">Booth: {selectedExhibitor.booth || "A01"}</span>
              </div>
            </div>
            <p><strong>Category:</strong> {selectedExhibitor.category || "General"}</p>
            <p><strong>Contact Email:</strong> {selectedExhibitor.contact_email}</p>
            <p><strong>Website:</strong> <a href={selectedExhibitor.website} target="_blank" rel="noreferrer">{selectedExhibitor.website || "N/A"}</a></p>
            <p><strong>Description:</strong> {selectedExhibitor.description}</p>

            {selectedExhibitor.products && selectedExhibitor.products.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3><Package size={18} /> Product Showcase</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  {selectedExhibitor.products.map((p, i) => (
                    <div key={i} style={{ border: "1px solid var(--line)", padding: "10px", borderRadius: "8px" }}>
                      <h4 style={{ margin: "0 0 4px" }}>{p.name}</h4>
                      <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 6px" }}>{p.description}</p>
                      <strong>${p.price}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
