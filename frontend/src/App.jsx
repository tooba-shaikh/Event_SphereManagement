import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Common Components
import Layout from "./components/common/Layout";

// Public Pages
import Home from "./pages/Home";
import Expos from "./pages/Expos";
import ExpoDetails from "./pages/ExpoDetails";
import Exhibitors from "./pages/Exhibitors";
import Schedule from "./pages/Schedule";
import FloorPlan from "./pages/FloorPlan";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dedicated Role Panels
import AdminDashboard from "./AdminDashboard";
import ExhibitorPortal from "./ExhibitorPortal";
import AttendeeDashboard from "./AttendeeDashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("eventsphere_user") || "null");
  });

  const handleLogout = () => {
    localStorage.removeItem("eventsphere_user");
    setCurrentUser(null);
  };

  return (
    <Routes>
      {/* Standalone Authentication Pages */}
      <Route path="/login" element={<Login onLoginSuccess={(user) => setCurrentUser(user)} />} />
      <Route path="/register" element={<Register onLoginSuccess={(user) => setCurrentUser(user)} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Main Website & Role Dashboards Wrapper */}
      <Route
        path="*"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/expos" element={<Expos />} />
              <Route path="/expos/:id" element={<ExpoDetails currentUser={currentUser} />} />
              <Route path="/exhibitors" element={<Exhibitors />} />
              <Route path="/schedule" element={<Schedule currentUser={currentUser} />} />
              <Route path="/floor-plan" element={<FloorPlan />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Role-Based Panels */}
              <Route
                path="/admin"
                element={
                  currentUser && (currentUser.user?.role === "admin" || currentUser.user?.role === "organizer") ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/exhibitor-portal"
                element={
                  currentUser && currentUser.user?.role === "exhibitor" ? (
                    <ExhibitorPortal />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/attendee-dashboard"
                element={
                  currentUser ? (
                    <AttendeeDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}