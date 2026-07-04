import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, ExternalLink, MapPin } from "lucide-react";
import Hero3D from "../components/Hero3D";
import { SITE_CONFIG } from "../data/config";
import VideoModal from "../components/VideoModal";

/* ── Tiny label — muted green or red depending on context ── */
function EyebrowLabel({ children, red = false }) {
  return (
    <span
      style={{
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.3em",
        fontWeight: 600,
        color: red ? "var(--rumr-red)" : "var(--rumr-green-soft)",
      }}
    >
      {children}
    </span>
  );
}

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div style={{ backgroundColor: "var(--rumr-bg)" }}>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative h-screen flex items-center px-6 md:px-12 overflow-hidden"
        style={{ backgroundColor: "var(--rumr-bg)" }}
      >
        {/* Ambient cinematic glow: emerald lower-left, red trace upper-right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background:
              "radial-gradient(ellipse 26% 32% at 16% 24%, rgba(255,224,170,0.09) 0%, transparent 62%)," +
              "radial-gradient(ellipse 60% 65% at 0% 70%, rgba(5,75,64,0.14) 0%, transparent 60%)," +
              "radial-gradient(ellipse 40% 40% at 88% 15%, rgba(255,59,48,0.06) 0%, transparent 55%)," +
              "radial-gradient(ellipse 35% 40% at 55% 50%, rgba(5,75,64,0.04) 0%, transparent 70%)",
          }}
        />

        {/* 3D object (desktop) */}
        <Hero3D />

        {/* Mobile static fallback glow */}
        <div
          className="absolute inset-0 md:hidden pointer-events-none"
          aria-hidden="true"
          style={{
            zIndex: 0,
            background:
              "radial-gradient(ellipse 80% 55% at 50% 60%, rgba(5,75,64,0.1) 0%, transparent 70%)," +
              "radial-gradient(ellipse 40% 30% at 85% 20%, rgba(255,59,48,0.05) 0%, transparent 60%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Red LIVE label */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--rumr-red)",
                  boxShadow: "0 0 8px var(--rumr-red-soft)",
                  display: "inline-block",
                  animation: "pulse 2s infinite",
                }}
              />
              <EyebrowLabel red>New Delhi Creative Studio</EyebrowLabel>
            </div>

            {/* Main headline */}
            <h1
              style={{
                fontSize: "clamp(58px, 11.5vw, 155px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.84,
                margin: 0,
              }}
            >
              MAKE YOUR
              <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                BRAND
              </em>
              <br />
              MOVE.
            </h1>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mt-4">
              <p
                style={{
                  fontSize: "clamp(15px, 1.8vw, 20px)",
                  color: "var(--rumr-text2)",
                  maxWidth: "420px",
                  lineHeight: 1.65,
                }}
              >
                {SITE_CONFIG.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                {/* Primary — red showreel */}
                <Link
                  to="/contact"
                  className="btn-red group"
                  style={{
                    padding: "16px 32px",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--rumr-red-h)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
                  }
                >
                  <Play size={14} fill="#fff" />
                  VIEW SHOWREEL
                </Link>
                {/* Secondary — emerald outline */}
                <Link
                  to="/work"
                  className="btn-emerald"
                  style={{
                    padding: "16px 32px",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                  }}
                >
                  EXPLORE OUR WORK
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ zIndex: 10 }}
        >
          <span
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "var(--rumr-text2)",
            }}
          >
            Scroll to enter the studio
          </span>
          <div
            style={{
              width: "1px",
              height: "48px",
              background:
                "linear-gradient(to bottom, var(--rumr-green-h), transparent)",
            }}
          />
        </motion.div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.35; }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════
          BRAND STATEMENT
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <EyebrowLabel>Our Purpose</EyebrowLabel>
            <h2
              className="mt-6 max-w-5xl"
              style={{
                fontSize: "clamp(38px, 7vw, 96px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.9,
              }}
            >
              WE BUILD VISUALS
              <br />
              THAT MAKE PEOPLE
              <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                STOP.
              </em>
            </h2>
            <p
              className="mt-10 max-w-3xl"
              style={{
                fontSize: "clamp(17px, 2vw, 22px)",
                color: "var(--rumr-text2)",
                lineHeight: 1.65,
              }}
            >
              {SITE_CONFIG.brandStatement.subheading}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED WORK
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg2)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <EyebrowLabel>Selected Work</EyebrowLabel>
              <h2
                className="mt-4"
                style={{
                  fontSize: "clamp(34px, 6vw, 78px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                  color: "var(--rumr-text)",
                  lineHeight: 0.92,
                }}
              >
                BUILT TO BE SEEN.
                <br />
                <em
                  className="serif-italic"
                  style={{ color: "var(--rumr-green-soft)" }}
                >
                  DESIGNED TO BE REMEMBERED.
                </em>
              </h2>
            </div>
            <Link
              to="/work"
              className="hidden md:flex items-center gap-3 group"
              style={{
                color: "var(--rumr-text)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              View All Work
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
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
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          {/* Work cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITE_CONFIG.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: index * 0.1 }}
                className={`group relative overflow-hidden cursor-pointer rounded-xl ${
                  index % 3 === 0
                    ? "md:col-span-2 aspect-[16/7]"
                    : "aspect-[4/5]"
                }`}
                style={{ backgroundColor: "var(--rumr-surface)" }}
                onClick={() => {
                  if (project.video) {
                    setActiveVideo(project.video);
                  }
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(55%) brightness(0.55)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter =
                      "grayscale(0%) brightness(0.75)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter =
                      "grayscale(55%) brightness(0.55)")
                  }
                />
                {/* Gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(9,11,11,0.95) 0%, rgba(9,11,11,0.15) 55%, transparent 100%)",
                  }}
                />
                {/* Emerald hover border */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(11,117,98,0.4)" }}
                />
                {/* Emerald bottom glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse 55% 35% at 50% 100%, rgba(5,75,64,0.18) 0%, transparent 70%)",
                  }}
                />

                <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {/* Category tag — emerald */}
                      <span
                        style={{
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: "0.25em",
                          color: "var(--rumr-green-soft)",
                          border: "1px solid rgba(11,117,98,0.3)",
                          backgroundColor: "rgba(5,75,64,0.12)",
                          padding: "3px 10px",
                          borderRadius: "2px",
                          fontWeight: 600,
                        }}
                      >
                        {project.category}
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                          color: "var(--rumr-text2)",
                        }}
                      >
                        {project.year}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "clamp(18px, 2.8vw, 34px)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        textTransform: "uppercase",
                        color: "var(--rumr-text)",
                        lineHeight: 1.05,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ fontSize: "13px", color: "var(--rumr-text2)" }}
                    >
                      {project.description}
                    </p>
                  </div>
                  {/* Red play button */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                    style={{
                      backgroundColor: "var(--rumr-red)",
                      boxShadow: "0 0 20px rgba(255,59,48,0.3)",
                    }}
                  >
                    <Play size={15} fill="#fff" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center md:hidden">
            <Link
              to="/work"
              className="btn-emerald"
              style={{ padding: "14px 32px", fontSize: "12px" }}
            >
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <EyebrowLabel>Expertise</EyebrowLabel>
            <h2
              className="mt-6"
              style={{
                fontSize: "clamp(38px, 8vw, 108px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.88,
              }}
            >
              WHAT WE MAKE
              <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                MOVE.
              </em>
            </h2>
          </div>

          <div style={{ borderTop: "1px solid var(--rumr-border)" }}>
            {SITE_CONFIG.services.map((service, i) => (
              <motion.div
                key={service.id}
                className="group py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                style={{
                  borderBottom: "1px solid var(--rumr-border)",
                  transition: "background-color 0.3s ease",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(5,75,64,0.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div className="flex items-start gap-10 md:gap-16">
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      tabularNums: true,
                      color: "var(--rumr-border)",
                      paddingTop: "4px",
                      flexShrink: 0,
                      fontFamily: "monospace",
                    }}
                  >
                    {service.id}
                  </span>
                  <div>
                    <h3
                      className="transition-all duration-500 group-hover:translate-x-2"
                      style={{
                        fontSize: "clamp(20px, 3.2vw, 42px)",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        textTransform: "uppercase",
                        color: "var(--rumr-text)",
                        marginBottom: "10px",
                        lineHeight: 1.1,
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--rumr-text2)",
                        maxWidth: "520px",
                        lineHeight: 1.65,
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
                {/* Red arrow on hover */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    border: "1px solid var(--rumr-border)",
                    color: "var(--rumr-green-soft)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--rumr-red)";
                    e.currentTarget.style.borderColor = "var(--rumr-red)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.transform = "rotate(45deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "var(--rumr-border)";
                    e.currentTarget.style.color = "var(--rumr-green-soft)";
                    e.currentTarget.style.transform = "rotate(0)";
                  }}
                >
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESS
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg2)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-20 text-center">
            <EyebrowLabel>Production Timeline</EyebrowLabel>
            <h2
              className="mt-6"
              style={{
                fontSize: "clamp(34px, 6vw, 78px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.9,
              }}
            >
              FROM IDEA
              <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                TO IMPACT.
              </em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SITE_CONFIG.process.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-8 rounded-xl flex flex-col gap-8 cursor-default transition-all duration-400"
                style={{
                  backgroundColor: "var(--rumr-surface)",
                  border: "1px solid var(--rumr-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--rumr-green-h)";
                  e.currentTarget.style.boxShadow =
                    "0 0 40px rgba(5,75,64,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--rumr-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--rumr-red)",
                  }}
                >
                  {step.id}
                </span>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    color: "var(--rumr-text)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "var(--rumr-text2)",
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-10 py-20 px-8 md:px-16 rounded-2xl"
            style={{
              border: "1px solid var(--rumr-border)",
              backgroundColor: "var(--rumr-bg3)",
            }}
          >
            {SITE_CONFIG.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4
                  style={{
                    fontSize: "clamp(34px, 5vw, 62px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    color: "var(--rumr-green-soft)",
                    marginBottom: "10px",
                  }}
                >
                  {stat.value}
                </h4>
                <p
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--rumr-text2)",
                  }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
          <p
            className="text-center mt-6"
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--rumr-border)",
            }}
          >
            * Placeholder values — replace with verified RUMR STUDIOS data
            before publishing.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT TEASER
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg2)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <EyebrowLabel>About the Studio</EyebrowLabel>
              <h2
                className="mt-6"
                style={{
                  fontSize: "clamp(34px, 5vw, 70px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  textTransform: "uppercase",
                  color: "var(--rumr-text)",
                  lineHeight: 0.9,
                }}
              >
                BUILT FOR
                <br />
                THE BRANDS
                <br />
                <em
                  className="serif-italic"
                  style={{ color: "var(--rumr-green-soft)" }}
                >
                  THAT WANT MORE.
                </em>
              </h2>
              <p
                className="mt-8 mb-10"
                style={{
                  fontSize: "16px",
                  color: "var(--rumr-text2)",
                  lineHeight: 1.7,
                  maxWidth: "480px",
                }}
              >
                RUMR STUDIOS is a New Delhi creative studio for brands that care
                about how they are seen, remembered, and experienced. We combine
                cinematic production, strategic content, digital design, and
                performance thinking to create work that does more than fill a
                feed.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="btn-emerald"
                  style={{ padding: "14px 28px", fontSize: "12px" }}
                >
                  Meet RUMR
                </Link>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    border: "1px solid var(--rumr-border)",
                    color: "var(--rumr-text2)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  <MapPin
                    size={12}
                    style={{ color: "var(--rumr-green-soft)" }}
                  />
                  Pitampura, New Delhi
                </div>
              </div>
            </Reveal>

            {/* BTS image mosaic */}
            <div className="grid grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1542204113-e9352628043e?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1598466173995-3b1764c703b1?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1504194104404-433180773017?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  className="overflow-hidden rounded-xl"
                  style={{ marginTop: i % 2 === 1 ? "48px" : "0" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <img
                    src={src}
                    alt={`BTS ${i + 1}`}
                    className="w-full object-cover transition-all duration-700"
                    style={{
                      height: "180px",
                      filter: "grayscale(60%) brightness(0.55)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.filter =
                        "grayscale(0%) brightness(0.8)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.filter =
                        "grayscale(60%) brightness(0.55)")
                    }
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INSTAGRAM STRIP
      ══════════════════════════════════════ */}
      <section
        className="py-36 px-6 md:px-12"
        style={{ backgroundColor: "var(--rumr-bg)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal className="mb-16 text-center">
            <EyebrowLabel>@rumrstudios_</EyebrowLabel>
            <h2
              className="mt-4"
              style={{
                fontSize: "clamp(26px, 4vw, 54px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.92,
              }}
            >
              FROM THE FLOOR.
              <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                FROM THE FRAME.
              </em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400",
                label: "On Set",
              },
              {
                src: "https://images.unsplash.com/photo-1531050171669-011123e833f1?auto=format&fit=crop&q=80&w=400",
                label: "Event",
              },
              {
                src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
                label: "Campaign",
              },
              {
                src: "https://images.unsplash.com/photo-1504194104404-433180773017?auto=format&fit=crop&q=80&w=400",
                label: "BTS",
              },
              {
                src: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=400",
                label: "Brand Shoot",
              },
              {
                src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400",
                label: "Studio",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                style={{ backgroundColor: "var(--rumr-surface)" }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(55%) brightness(0.55)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter =
                      "grayscale(0%) brightness(0.75)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter =
                      "grayscale(55%) brightness(0.55)")
                  }
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                  style={{ backgroundColor: "rgba(9,11,11,0.55)" }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "var(--rumr-green-soft)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://instagram.com/rumrstudios_"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald"
              style={{ padding: "14px 30px", fontSize: "12px" }}
            >
              <ExternalLink size={13} />
              Follow @rumrstudios_
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section
        className="py-48 px-6 md:px-12 text-center overflow-hidden"
        style={{ backgroundColor: "var(--rumr-bg2)" }}
      >
        <div className="max-w-5xl mx-auto relative">
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "700px",
              height: "400px",
              background:
                "radial-gradient(ellipse, rgba(5,75,64,0.1) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 65% 35%, rgba(255,59,48,0.04) 0%, transparent 65%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <motion.div
            initial={{ scale: 0.93, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <EyebrowLabel>Start a Project</EyebrowLabel>
            <h2
              className="mt-6 mb-14"
              style={{
                fontSize: "clamp(46px, 9vw, 116px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.84,
              }}
            >
              LET'S MAKE
              <br />
              SOMETHING
              <br />
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                WORTH WATCHING.
              </em>
            </h2>
            <p
              className="mb-12"
              style={{ fontSize: "17px", color: "var(--rumr-text2)" }}
            >
              Tell us what you are building. We'll bring the visual energy.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-5">
              <Link
                to="/contact"
                className="btn-red"
                style={{ padding: "20px 48px", fontSize: "15px" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
                }
              >
                Start a Project
              </Link>
              <a
                href={`mailto:${SITE_CONFIG.brand.email}`}
                className="btn-emerald"
                style={{ padding: "20px 48px", fontSize: "15px" }}
              >
                Email RUMR
              </a>
            </div>
            <div className="mt-14 flex flex-col md:flex-row justify-center items-center gap-6">
              <div
                className="flex items-center gap-2"
                style={{ fontSize: "12px", color: "var(--rumr-text2)" }}
              >
                <MapPin size={13} style={{ color: "var(--rumr-green-soft)" }} />
                Pitampura, New Delhi, India
              </div>
              <div
                className="hidden md:block w-1 h-1 rounded-full"
                style={{ backgroundColor: "var(--rumr-border)" }}
              />
              <a
                href="https://instagram.com/rumrstudios_"
                style={{
                  fontSize: "12px",
                  color: "var(--rumr-text2)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-green-soft)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rumr-text2)")
                }
              >
                @rumrstudios_
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            videoUrl={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}