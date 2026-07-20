import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import CosmicDust from "./components/CosmicDust";
import CustomCursor from "./components/CustomCursor";
import Particles from "./components/Particles";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Work from "./pages/Work";
import BrandDetail from "./pages/BrandDetail";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AppShell() {
  return (
    <div
      className="min-h-screen antialiased relative"
      style={{ backgroundColor: "var(--rumr-bg)", color: "var(--rumr-text)" }}
    >
      <Analytics />
      <SpeedInsights />
      <CustomCursor />
      <CosmicDust particleCount={60} speedMultiplier={0.4} particleSize={0.8} />
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={150}
        ease={80}
        color="#ffffff"
        refresh
      />
      <div className="grain-overlay" aria-hidden="true" />
      <Navigation />
      {/* Sidebar offset wrapper */}
      <div className="rumr-content-area">
        <style>{`
          .rumr-content-area { transition: margin-left 0.3s ease; }
          @media(min-width:768px){ .rumr-content-area { margin-left: 72px; } }
        `}</style>
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:brandId" element={<BrandDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  );
}
