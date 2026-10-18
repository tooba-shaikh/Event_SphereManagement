import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, currentUser, onLogout }) {
  return (
    <div className="app">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
