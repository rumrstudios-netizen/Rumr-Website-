import React from "react";
import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../data/config";
import { Instagram, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--rumr-bg2)",
        paddingTop: "120px",
        paddingBottom: "48px",
        borderTop: "1px solid var(--rumr-border)",
      }}
      className="px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <h2
              className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-[0.9]"
              style={{ color: "var(--rumr-text)" }}
            >
              LET'S MAKE <br />
              SOMETHING <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                WORTH WATCHING.
              </em>
            </h2>
            <p
              className="text-lg max-w-md mb-10 leading-relaxed"
              style={{ color: "var(--rumr-text2)" }}
            >
              Tell us what you are building. We'll bring the visual energy to
              make your brand impossible to ignore.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 group text-xl font-bold uppercase tracking-tighter"
              style={{ color: "var(--rumr-text)", textDecoration: "none" }}
            >
              Start a Project
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: "1px solid var(--rumr-border)",
                  color: "var(--rumr-green-soft)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--rumr-green)";
                  e.currentTarget.style.borderColor = "var(--rumr-green)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "var(--rumr-border)";
                }}
              >
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <span
                className="text-[10px] uppercase tracking-[0.2em] block mb-5"
                style={{ color: "var(--rumr-text2)" }}
              >
                Navigation
              </span>
              <div className="flex flex-col gap-3">
                {SITE_CONFIG.navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium transition-colors duration-300"
                    style={{
                      color: "var(--rumr-text)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--rumr-green-soft)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--rumr-text)")
                    }
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <span
                className="text-[10px] uppercase tracking-[0.2em] block mb-5"
                style={{ color: "var(--rumr-text2)" }}
              >
                Social
              </span>
              <a
                href={SITE_CONFIG.brand.instagramUrl}
                className="flex items-center gap-2 text-sm font-medium transition-colors duration-300"
                style={{ color: "var(--rumr-text)", textDecoration: "none" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-green-soft)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-text)")
                }
              >
                <Instagram
                  size={14}
                  style={{ color: "var(--rumr-green-soft)" }}
                />
                {SITE_CONFIG.brand.instagram}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <span
                className="text-[10px] uppercase tracking-[0.2em] block mb-5"
                style={{ color: "var(--rumr-text2)" }}
              >
                Location
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--rumr-text)" }}
              >
                {SITE_CONFIG.brand.location} <br />
                New Delhi, India
              </p>
            </div>
            <div>
              <span
                className="text-[10px] uppercase tracking-[0.2em] block mb-5"
                style={{ color: "var(--rumr-text2)" }}
              >
                Contact
              </span>
              <a
                href={`mailto:${SITE_CONFIG.brand.email}`}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: "var(--rumr-text)", textDecoration: "none" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-green-soft)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-text)")
                }
              >
                {SITE_CONFIG.brand.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center pt-10 gap-6"
          style={{ borderTop: "1px solid var(--rumr-border)" }}
        >
          <div className="flex items-center gap-3">
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
              className="text-sm font-bold tracking-tight"
              style={{ color: "var(--rumr-text)" }}
            >
              {SITE_CONFIG.brand.name}
            </span>
          </div>
          <div
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--rumr-text2)" }}
          >
            © {new Date().getFullYear()} — ALL RIGHTS RESERVED
          </div>
          <div
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--rumr-border)" }}
          >
            New Delhi, India
          </div>
        </div>
      </div>
    </footer>
  );
}
