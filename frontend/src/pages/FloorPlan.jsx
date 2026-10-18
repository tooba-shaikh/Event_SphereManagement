import React, { useState, useEffect } from "react";
import api from "../api";
import { PageHero } from "./Expos";

export default function FloorPlan() {
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    api.get("/booths")
      .then((res) => setBooths(res.data))
      .catch((err) => console.log(err));
  }, []);

  const defaultCells = [
    { num: "A01", label: "A01" },
    { num: "A02", label: "A02" },
    { num: "A03", label: "A03" },
    { num: "A04", label: "A04" },
    { num: "B01", label: "B01" },
    { num: "STAGE", label: "MAIN STAGE", special: true },
    { num: "B03", label: "B03" },
    { num: "B04", label: "B04" },
    { num: "C01", label: "C01" },
    { num: "C02", label: "C02" },
    { num: "LOUNGE", label: "VIP LOUNGE", special: true },
    { num: "C04", label: "C04" },
    { num: "D01", label: "D01" },
    { num: "D02", label: "D02" },
    { num: "D03", label: "D03" },
    { num: "D04", label: "D04" }
  ];

  return (
    <>
      <PageHero kicker="FIND YOUR WAY" title="Interactive floor plan" text="Real-time view of allocated booths and event spaces." />
      <section className="section">
        <div className="container">
          <div className="floor">
            <div className="floor-top">
              <span>MAIN ENTRANCE</span>
              <div className="legend">
                <i></i> Available booth
                <i style={{ background: "var(--blue2)" }}></i> Occupied booth
                <i className="yellow-dot"></i> Special Feature Area
              </div>
            </div>
            <div className="floor-grid">
              {defaultCells.map((cell) => {
                const b = booths.find((x) => x.booth_number === cell.num);
                const isOccupied = b && b.status === "occupied";
                return (
                  <div
                    key={cell.num}
                    className={`floor-cell ${cell.special ? "special" : ""}`}
                    style={isOccupied ? { background: "#cbe0ff", borderColor: "var(--blue2)" } : {}}
                    title={b ? `Booth ${cell.num}: ${b.exhibitor_name || b.status}` : `Booth ${cell.num}`}
                  >
                    <div style={{ textAlign: "center" }}>
                      <strong>{cell.label}</strong>
                      {b && b.exhibitor_name && (
                        <div style={{ fontSize: "10px", fontWeight: "600", color: "var(--navy)" }}>
                          {b.exhibitor_name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="floor-bottom">
              <span>FOOD & NETWORKING HUB</span>
              <span>REGISTRATION DESK</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
