import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Instagram, ArrowRight, Play } from "lucide-react";
import { SITE_CONFIG } from "../data/config";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
          padding: scrolled ? "14px 0" : "26px 0",
          backgroundColor: scrolled ? "rgba(9,11,11,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(44,74,64,0.45)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1600px] mx-auto">
          {/* ── RUMR STUDIOS wordmark ── */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: "var(--rumr-green)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "var(--rumr-text)",
                  fontSize: "9px",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                R
              </span>
            </div>
            <span
              style={{
                color: "var(--rumr-text)",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              RUMR STUDIOS
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-10">
            {SITE_CONFIG.navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="relative group"
                style={{
                  color: "var(--rumr-text2)",
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
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-text2)")
                }
              >
                {item.name}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: "var(--rumr-green-h)",
                    display: "block",
                  }}
                />
              </Link>
            ))}

            {/* Hot-red VIEW SHOWREEL */}
            <Link
              to="/contact"
              className="btn-red"
              style={{
                padding: "10px 22px",
                fontSize: "11px",
                letterSpacing: "0.08em",
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

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2"
            aria-label="Open menu"
            style={{
              color: "var(--rumr-text)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ── Full-screen overlay ── */}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    backgroundColor: "var(--rumr-green)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "var(--rumr-text)",
                      fontSize: "8px",
                      fontWeight: 900,
                    }}
                  >
                    R
                  </span>
                </div>
                <span
                  style={{
                    color: "var(--rumr-text)",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  RUMR STUDIOS
                </span>
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
                  <Instagram
                    size={13}
                    style={{ color: "var(--rumr-green-soft)" }}
                  />
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
