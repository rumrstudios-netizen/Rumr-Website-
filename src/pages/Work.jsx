import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, MapPin, FolderOpen } from "lucide-react";
import { SITE_CONFIG } from "../data/config";
import VideoModal from "../components/VideoModal";

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

export default function WorkPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null);
  const categories = [
    "All",
    "Ad Films",
    "Event Cinematography",
    "Brand Campaign",
    "Social Content",
    "Website Experiences",
  ];
  const filteredProjects =
    activeFilter === "All"
      ? SITE_CONFIG.projects
      : SITE_CONFIG.projects.filter((p) => p.category === activeFilter);

  return (
    <div
      style={{ backgroundColor: "var(--rumr-bg)", minHeight: "100vh" }}
      className="pt-40 pb-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-28">
          <EyebrowLabel>Portfolio</EyebrowLabel>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(54px, 10vw, 128px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.86,
              marginTop: "16px",
            }}
          >
            WORK THAT
            <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              MOVES.
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{
              marginTop: "28px",
              fontSize: "clamp(15px, 1.8vw, 20px)",
              color: "var(--rumr-text2)",
              maxWidth: "560px",
              lineHeight: 1.65,
            }}
          >
            Films, campaigns, experiences, and digital work made for attention
            and designed to be remembered.
          </motion.p>
        </header>

        {/* Filters — active uses Rumr emerald */}
        <div
          className="flex flex-wrap gap-3 mb-16 pb-10"
          style={{ borderBottom: "1px solid var(--rumr-border)" }}
        >
          {categories.map((cat) => {
            const active = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  backgroundColor: active ? "var(--rumr-green)" : "transparent",
                  color: active ? "var(--rumr-text)" : "var(--rumr-text2)",
                  border: active
                    ? "1px solid var(--rumr-green)"
                    : "1px solid var(--rumr-border)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--rumr-green-h)";
                    e.currentTarget.style.color = "var(--rumr-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--rumr-border)";
                    e.currentTarget.style.color = "var(--rumr-text2)";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45 }}
                className={`group cursor-pointer ${index % 3 === 0 ? "md:col-span-2" : ""}`}
                onClick={() => navigate(`/work/${project.id}`)}
              >
                <div
                  className={`relative overflow-hidden rounded-xl ${index % 3 === 0 ? "aspect-[21/8]" : "aspect-[4/5]"}`}
                  style={{ backgroundColor: "var(--rumr-surface)" }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    style={{ filter: "grayscale(50%) brightness(0.55)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.filter =
                        "grayscale(0%) brightness(0.75)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.filter =
                        "grayscale(50%) brightness(0.55)")
                    }
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(9,11,11,0.9) 0%, transparent 60%)",
                    }}
                  />
                  {/* Emerald border on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(11,117,98,0.35)",
                    }}
                  />
                  {/* Folder Open icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        backgroundColor: "var(--rumr-green)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 28px rgba(11,117,98,0.4)",
                      }}
                    >
                      <FolderOpen size={26} className="text-black" />
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
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
                        {project.year}
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: "0.25em",
                          color: "var(--rumr-red)",
                          border: "1px solid rgba(255,59,48,0.3)",
                          backgroundColor: "rgba(255,59,48,0.08)",
                          padding: "3px 10px",
                          borderRadius: "2px",
                          fontWeight: 600,
                        }}
                      >
                        {project.shoots?.length || 0} FILES
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "var(--rumr-text2)",
                          fontWeight: 500,
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "clamp(20px, 3.2vw, 42px)",
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
                      className="mt-2"
                      style={{ fontSize: "13px", color: "var(--rumr-text2)" }}
                    >
                      {project.description}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ml-4"
                    style={{
                      border: "1px solid var(--rumr-border)",
                      color: "var(--rumr-green-soft)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--rumr-green)";
                      e.currentTarget.style.borderColor = "var(--rumr-green)";
                      e.currentTarget.style.color = "var(--rumr-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "var(--rumr-border)";
                      e.currentTarget.style.color = "var(--rumr-green-soft)";
                    }}
                  >
                    <ArrowRight size={17} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-40 p-12 md:p-20 rounded-2xl text-center"
          style={{
            backgroundColor: "var(--rumr-bg2)",
            border: "1px solid var(--rumr-border)",
          }}
        >
          <EyebrowLabel>Let's Build Something</EyebrowLabel>
          <h2
            className="mt-6 mb-10"
            style={{
              fontSize: "clamp(34px, 6vw, 78px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "var(--rumr-text)",
              lineHeight: 0.9,
            }}
          >
            HAVE A PROJECT <br />
            <em
              className="serif-italic"
              style={{ color: "var(--rumr-green-soft)" }}
            >
              IN MIND?
            </em>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-5">
            <Link
              to="/contact"
              className="btn-red"
              style={{ padding: "18px 44px", fontSize: "14px" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
              }
            >
              Let's Talk
            </Link>
            <a
              href={`mailto:${SITE_CONFIG.brand.email}`}
              className="btn-emerald"
              style={{ padding: "18px 44px", fontSize: "14px" }}
            >
              Email RUMR
            </a>
          </div>
          <div
            className="mt-10 flex justify-center items-center gap-2"
            style={{ fontSize: "12px", color: "var(--rumr-text2)" }}
          >
            <MapPin size={13} style={{ color: "var(--rumr-green-soft)" }} />
            Pitampura, New Delhi, India
          </div>
        </div>
      </div>

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
