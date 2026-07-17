import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Instagram,
  ArrowRight,
  Play,
  Briefcase,
  Layers,
  Users,
  Mail,
  Home,
} from "lucide-react";
import { SITE_CONFIG } from "../data/config";
import RumrLogo, { RumrIcon } from "./RumrLogo";

/* Icon map for each nav item */
const NAV_ICONS = {
  Work: Briefcase,
  Services: Layers,
  About: Users,
  Contact: Mail,
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href) => location.pathname === href;

  /* ─── Sidebar widths ─── */
  const COLLAPSED = 72;
  const EXPANDED = 240;

  return (
    <>
      {/* ══════════════════════════════════════════════
          DESKTOP — Fixed vertical sidebar (left)
         ══════════════════════════════════════════════ */}
      <nav
        className="hidden md:flex"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: hovered ? `${EXPANDED}px` : `${COLLAPSED}px`,
          zIndex: 100,
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "rgba(7,9,8,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(41,72,59,0.4)",
          padding: "24px 0",
          transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
          overflow: "hidden",
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            height: "32px",
            padding: "0 20px",
            marginBottom: "48px",
            whiteSpace: "nowrap",
          }}
        >
          {hovered ? (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <RumrLogo height={44} />
            </motion.div>
          ) : (
            <RumrIcon size={32} />
          )}
        </Link>

        {/* ── Nav links ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {SITE_CONFIG.navigation.map((item) => {
            const Icon = NAV_ICONS[item.name] || Home;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 20px",
                  textDecoration: "none",
                  color: active ? "var(--rumr-text)" : "var(--rumr-text2)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  position: "relative",
                  transition: "color 0.25s ease, background-color 0.25s ease",
                  backgroundColor: active ? "rgba(10,61,50,0.25)" : "transparent",
                  borderLeft: active
                    ? "2px solid var(--rumr-green-h)"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--rumr-text)";
                    e.currentTarget.style.backgroundColor = "rgba(10,61,50,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--rumr-text2)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.3s ease 0.05s",
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom: Showreel + Social ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "0 14px",
          }}
        >
          {/* Showreel button */}
          <Link
            to="/contact"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: hovered ? "10px 16px" : "10px 0",
              backgroundColor: "var(--rumr-red)",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
            }
          >
            <Play size={12} fill="#fff" style={{ flexShrink: 0 }} />
            <span
              style={{
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            >
              SHOWREEL
            </span>
          </Link>

          {/* Instagram */}
          <a
            href={SITE_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "10px 0",
              color: "var(--rumr-text2)",
              textDecoration: "none",
              fontSize: "11px",
              fontWeight: 600,
              transition: "color 0.25s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rumr-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rumr-text2)")}
          >
            <Instagram size={16} style={{ flexShrink: 0 }} />
            <span
              style={{
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            >
              {SITE_CONFIG.brand.instagram}
            </span>
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          DESKTOP — Top navigation bar (Overlay)
         ══════════════════════════════════════════════ */}
      <nav
        className="hidden md:block"
        style={{
          position: "fixed",
          top: 0,
          left: hovered ? `${EXPANDED}px` : `${COLLAPSED}px`,
          width: hovered ? `calc(100% - ${EXPANDED}px)` : `calc(100% - ${COLLAPSED}px)`,
          zIndex: 90,
          transition: "left 0.4s cubic-bezier(0.16,1,0.3,1), width 0.4s cubic-bezier(0.16,1,0.3,1), padding 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.45s ease, border-bottom 0.45s ease",
          padding: scrolled ? "14px 0" : "26px 0",
          backgroundColor: scrolled ? "rgba(9,11,11,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(44,74,64,0.45)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1600px] mx-auto">
          {/* ── Logo ── */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RumrLogo height={36} />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="flex items-center gap-10">
            {SITE_CONFIG.navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group"
                  style={{
                    color: active ? "var(--rumr-text)" : "var(--rumr-text2)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--rumr-text)")
                  }
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--rumr-text2)";
                    }
                  }}
                >
                  {item.name}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                    style={{
                      backgroundColor: "var(--rumr-green-h)",
                      display: "block",
                      width: active ? "100%" : undefined,
                    }}
                  />
                </Link>
              );
            })}

            {/* VIEW SHOWREEL */}
            <Link
              to="/contact"
              className="btn-red"
              style={{
                padding: "10px 22px",
                fontSize: "11px",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                borderRadius: "9999px",
                color: "#fff",
                fontWeight: 700,
                backgroundColor: "var(--rumr-red)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
              }
            >
              <Play size={11} fill="#fff" />
              VIEW SHOWREEL
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          MOBILE — Top bar + full-screen overlay
         ══════════════════════════════════════════════ */}
      <nav
        className="flex md:hidden justify-between items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          padding: "14px 20px",
          backgroundColor: "rgba(9,11,11,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(44,74,64,0.45)",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <RumrLogo height={32} />
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          style={{
            color: "var(--rumr-text)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              backgroundColor: "var(--rumr-bg)",
              display: "flex",
              flexDirection: "column",
              padding: "24px 40px",
            }}
          >
            {/* Ambient glows */}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "-5%",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(5,75,64,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "8%",
                right: "5%",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,59,48,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Top bar */}
            <div className="flex justify-between items-center relative z-10">
              <div style={{ display: "flex", alignItems: "center" }}>
                <RumrLogo height={32} />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                style={{
                  color: "var(--rumr-text2)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                <X size={28} />
              </button>
            </div>

            {/* Big nav links */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
              {SITE_CONFIG.navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.22 + index * 0.07, ease: "easeOut" }}
                  className="group flex items-center gap-5"
                  style={{
                    fontSize: "clamp(44px, 9vw, 88px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    color: "var(--rumr-text)",
                    textDecoration: "none",
                    lineHeight: 1.1,
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(44,74,64,0.25)",
                    transition: "color 0.25s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--rumr-green-soft)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--rumr-text)")
                  }
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      color: "var(--rumr-red)",
                      minWidth: "28px",
                    }}
                  >
                    0{index + 1}
                  </span>
                  {item.name}
                  <ArrowRight
                    size={24}
                    style={{
                      color: "var(--rumr-red)",
                      marginLeft: "auto",
                      opacity: 0,
                      transition: "opacity 0.2s, transform 0.2s",
                      transform: "translateX(-8px)",
                    }}
                    className="group-hover:opacity-100"
                  />
                </motion.a>
              ))}
            </div>

            {/* Footer strip */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 relative z-10"
              style={{ borderTop: "1px solid var(--rumr-border)" }}
            >
              <div>
                <span
                  style={{
                    color: "var(--rumr-text2)",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Social
                </span>
                <a
                  href={SITE_CONFIG.brand.instagramUrl}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--rumr-text)",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <Instagram size={13} style={{ color: "var(--rumr-green-soft)" }} />
                  {SITE_CONFIG.brand.instagram}
                </a>
              </div>
              <div>
                <span
                  style={{
                    color: "var(--rumr-text2)",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Location
                </span>
                <span
                  style={{
                    color: "var(--rumr-text)",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {SITE_CONFIG.brand.location}, India
                </span>
              </div>
              <div>
                <span
                  style={{
                    color: "var(--rumr-text2)",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </span>
                <a
                  href={`mailto:${SITE_CONFIG.brand.email}`}
                  style={{
                    color: "var(--rumr-text)",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {SITE_CONFIG.brand.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
