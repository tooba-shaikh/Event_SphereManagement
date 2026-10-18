import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="notfound">
      <h1>404</h1>
      <h2>Page not found</h2>
      <Link className="btn" to="/">Back home</Link>
    </section>
  );
}
