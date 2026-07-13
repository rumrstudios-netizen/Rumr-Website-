import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { SITE_CONFIG } from "../data/config";
import {
  Instagram,
  MapPin,
  Target,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";

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

const valueIcons = {
  0: <Zap size={20} />,
  1: <Target size={20} />,
  2: <Sparkles size={20} />,
  3: <MapPin size={20} />,
  4: <ShieldCheck size={20} />,
};

export default function AboutPage() {
  return (
    <div
      style={{ backgroundColor: "var(--rumr-bg)", minHeight: "100vh" }}
      className="pt-40"
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero */}
        <header className="mb-36">
          <EyebrowLabel>Our Story</EyebrowLabel>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(46px, 9vw, 116px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.86,
              marginTop: "16px",
            }}
          >
            WE BELIEVE
            <br />
            GOOD WORK
            <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              SHOULD FEEL ALIVE.
            </em>
          </motion.h1>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                color: "var(--rumr-text2)",
                lineHeight: 1.65,
              }}
            >
              RUMR STUDIOS exists to help brands communicate with more clarity,
              more personality, and more visual impact.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              style={{
                fontSize: "15px",
                color: "var(--rumr-text2)",
                lineHeight: 1.7,
              }}
            >
              We are a team of creators, shooters, editors, designers, and
              strategists based in New Delhi who believe the best work happens
              where craft meets culture. We don't just create content — we
              create presence.
            </motion.p>
          </div>
        </header>

        {/* Full-width BTS visual */}
        <section
          className="mb-48 relative rounded-2xl overflow-hidden"
          style={{ height: "clamp(320px, 60vh, 70vh)" }}
        >
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000"
            alt="Behind the scenes at RUMR STUDIOS"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(25%) brightness(0.45)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(9,11,11,0.92) 0%, rgba(9,11,11,0.15) 55%, transparent 100%), radial-gradient(ellipse 50% 60% at 8% 60%, rgba(5,75,64,0.1) 0%, transparent 60%), radial-gradient(ellipse 35% 35% at 88% 18%, rgba(255,59,48,0.05) 0%, transparent 55%)",
            }}
          />
          {/* Location badge */}
          <div style={{ position: "absolute", bottom: "36px", left: "36px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 18px",
                borderRadius: "10px",
                backgroundColor: "rgba(23,54,45,0.88)",
                border: "1px solid var(--rumr-border)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  backgroundColor: "var(--rumr-green)",
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
              <div>
                <span
                  style={{
                    fontSize: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.25em",
                    display: "block",
                    color: "var(--rumr-text2)",
                  }}
                >
                  Based in
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--rumr-text)",
                  }}
                >
                  {SITE_CONFIG.brand.location}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-48">
          <div className="text-center mb-16">
            <EyebrowLabel>Core Values</EyebrowLabel>
            <h2
              style={{
                marginTop: "14px",
                fontSize: "clamp(26px, 4vw, 54px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
              }}
            >
              WHAT WE{" "}
              <em
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)" }}
              >
                STAND FOR.
              </em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SITE_CONFIG.values.map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-8 rounded-xl flex flex-col gap-6 cursor-default"
                style={{
                  backgroundColor: "var(--rumr-surface)",
                  border: "1px solid var(--rumr-border)",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
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
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(5,75,64,0.12)",
                    color: "var(--rumr-green-soft)",
                    border: "1px solid rgba(11,117,98,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {valueIcons[index] || <Sparkles size={20} />}
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      display: "block",
                      marginBottom: "6px",
                      color: "var(--rumr-red)",
                    }}
                  >
                    0{index + 1}
                  </span>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      lineHeight: 1.3,
                      color: "var(--rumr-text)",
                    }}
                  >
                    {value}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process + BTS grid */}
        <section
          className="mb-48 py-20 px-10 md:px-16 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
          style={{
            backgroundColor: "var(--rumr-bg2)",
            border: "1px solid var(--rumr-border)",
          }}
        >
          <div>
            <EyebrowLabel>Our Process</EyebrowLabel>
            <h2
              style={{
                marginTop: "20px",
                marginBottom: "36px",
                fontSize: "clamp(26px, 4vw, 54px)",
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
            <p
              style={{
                fontSize: "15px",
                marginBottom: "44px",
                maxWidth: "420px",
                lineHeight: 1.7,
                color: "var(--rumr-text2)",
              }}
            >
              We combine cinematic production, strategic content, digital
              design, and performance thinking to create work that does more
              than fill a feed.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {SITE_CONFIG.process.map((step) => (
                <div
                  key={step.id}
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "28px 0",
                    borderBottom: "1px solid var(--rumr-border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 900,
                      fontFamily: "monospace",
                      marginTop: "2px",
                      flexShrink: 0,
                      color: "var(--rumr-red)",
                    }}
                  >
                    {step.id}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                        color: "var(--rumr-text)",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: "var(--rumr-text2)",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              "https://images.unsplash.com/photo-1542204113-e9352628043e?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1598466173995-3b1764c703b1?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1504194104404-433180773017?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
            ].map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl"
                style={{ marginTop: i % 2 === 1 ? "48px" : "0" }}
              >
                <img
                  src={src}
                  alt={`BTS ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                  style={{
                    height: "180px",
                    filter: "grayscale(55%) brightness(0.5)",
                    transition: "filter 0.7s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter =
                      "grayscale(0%) brightness(0.75)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter =
                      "grayscale(55%) brightness(0.5)")
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mb-24 py-32 px-12 text-center rounded-2xl"
          style={{
            backgroundColor: "var(--rumr-bg2)",
            border: "1px solid var(--rumr-border)",
          }}
        >
          <EyebrowLabel>Let's Begin</EyebrowLabel>
          <h2
            style={{
              marginTop: "20px",
              marginBottom: "44px",
              fontSize: "clamp(34px, 6vw, 78px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.9,
            }}
          >
            LET'S MAKE
            <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              HISTORY.
            </em>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-5">
            <Link
              to="/contact"
              className="btn-red"
              style={{ padding: "18px 48px", fontSize: "15px" }}
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
              href={SITE_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald"
              style={{ padding: "18px 48px", fontSize: "15px" }}
            >
              <Instagram size={16} />
              {SITE_CONFIG.brand.instagram}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
