import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring } from "motion/react";
import { ArrowRight, Play, ExternalLink, MapPin, FolderOpen } from "lucide-react";
import Hero3D from "../components/Hero3D";
import { SITE_CONFIG } from "../data/config";
import VideoModal from "../components/VideoModal";
import MagneticButton from "../components/MagneticButton";
import StaggeredText from "../components/StaggeredText";
import ParallaxImage from "../components/ParallaxImage";
import GlowCard from "../components/GlowCard";

/* â”€â”€ Tiny label â€” muted green or red depending on context â”€â”€ */
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

/* â”€â”€ Scroll-reveal wrapper â”€â”€ */
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

/* ── Full-viewport work card (3D Horizontal Scroll) ── */
function WorkCard({ project, index, totalSlides, scrollProgress, onClick, isActive }) {
  const step = 1 / (totalSlides - 1);
  const activePoint = (index + 1) * step;

  // Build keyframes for Cover Flow (-2: far right, 0: center, 2: far left)
  const points = [];
  const xValues = [];
  const rotateYValues = [];
  const scaleValues = [];
  const opacityValues = [];
  const zIndexValues = [];

  for (let i = -2; i <= 2; i++) {
    points.push(activePoint + i * step);
    xValues.push(`${i * 65}vw`); 
    rotateYValues.push(i * -45); 
    scaleValues.push(1 - Math.abs(i) * 0.2); 
    opacityValues.push(1 - Math.abs(i) * 0.4); 
    zIndexValues.push(50 - Math.abs(i) * 10);
  }

  const x = useTransform(scrollProgress, points, xValues);
  const rotateY = useTransform(scrollProgress, points, rotateYValues);
  const scale = useTransform(scrollProgress, points, scaleValues);
  const opacity = useTransform(scrollProgress, points, opacityValues);
  const dynamicZ = useTransform(scrollProgress, points, zIndexValues);

  const imgY = useTransform(scrollProgress, [activePoint - step, activePoint], ["-6%", "0%"]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 6rem)",
        boxSizing: "border-box",
        x,
        zIndex: dynamicZ,
        opacity,
        perspective: "2000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "calc(100% - clamp(4rem, 10vw, 12rem))",
          height: "calc(100% - clamp(4rem, 10vw, 12rem))",
          backgroundColor: "rgba(11, 117, 98, 0.05)",
          border: "1px solid rgba(11, 117, 98, 0.15)",
          borderRadius: "20px",
          scale,
          rotateY,
          zIndex: 1,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          width: "88%",
          aspectRatio: "16 / 10",
          maxHeight: "85%",
          scale,
          rotateY,
          zIndex: 2,
          pointerEvents: isActive ? "auto" : "none",
          willChange: "transform",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: "-36px",
              left: "0",
              height: "37px",
              width: "clamp(150px, 15vw, 240px)",
              backgroundColor: "var(--rumr-surface)",
              borderTop: "1px solid var(--rumr-border)",
              borderLeft: "1px solid var(--rumr-border)",
              borderRight: "1px solid var(--rumr-border)",
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              zIndex: 3,
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "var(--rumr-red)",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              FILE // 0{index + 1}
            </span>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: "var(--rumr-surface)",
              border: "1px solid var(--rumr-border)",
              borderTopRightRadius: "20px",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
              borderTopLeftRadius: "0px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--rumr-green-h)";
              e.currentTarget.style.boxShadow = "0 0 60px rgba(5,75,64,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--rumr-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "115%",
                objectFit: "cover",
                filter: isActive ? "grayscale(10%) brightness(0.5)" : "grayscale(50%) brightness(0.3)",
                y: imgY,
                transition: "filter 0.5s ease",
              }}
              onMouseEnter={(e) => {
                if (isActive) {
                  e.currentTarget.style.filter = "grayscale(0%) brightness(0.7)";
                }
              }}
              onMouseLeave={(e) => {
                if (isActive) {
                  e.currentTarget.style.filter = "grayscale(10%) brightness(0.5)";
                }
              }}
            />
            
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(9,11,11,0.95) 0%, rgba(9,11,11,0.4) 40%, rgba(9,11,11,0.1) 70%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "clamp(2rem, 6vh, 4rem)",
                left: "clamp(2rem, 5vw, 4rem)",
                right: "clamp(2rem, 5vw, 4rem)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                zIndex: 4,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      color: "var(--rumr-green-soft)",
                      border: "1px solid rgba(11,117,98,0.3)",
                      backgroundColor: "rgba(5,75,64,0.12)",
                      padding: "4px 12px",
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
                      letterSpacing: "0.25em",
                      color: "var(--rumr-red)",
                      border: "1px solid rgba(255,59,48,0.3)",
                      backgroundColor: "rgba(255,59,48,0.08)",
                      padding: "4px 12px",
                      borderRadius: "2px",
                      fontWeight: 600,
                    }}
                  >
                    {project.shoots?.length || 0} FILES
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
                    fontSize: "clamp(24px, 4vw, 56px)",
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
                  style={{
                    marginTop: "12px",
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    color: "var(--rumr-text2)",
                    maxWidth: "500px",
                    lineHeight: 1.6,
                  }}
                >
                  {project.description}
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor: "var(--rumr-red)",
                  boxShadow: "0 0 30px rgba(255,0,0,0.4)",
                  transition: "transform 0.3s ease",
                }}
              >
                <FolderOpen size={20} className="text-black" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Progress dot for scroll-jacked work section ── */
function ProgressDot({ index, totalSlides, scrollProgress }) {
  const step = 1 / (totalSlides - 1);
  const center = index * step;

  const dotScale = useTransform(
    scrollProgress,
    [center - step * 0.5, center, center + step * 0.5],
    [1, 1.8, 1]
  );

  const dotBg = useTransform(
    scrollProgress,
    [center - step * 0.5, center, center + step * 0.5],
    ["rgba(11,117,98,0.3)", "rgba(11,117,98,1)", "rgba(11,117,98,0.3)"]
  );

  return (
    <motion.div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: dotBg,
        scale: dotScale,
      }}
    />
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);

  /* Scroll-jacked work section */
  const workSectionRef = useRef(null);
  const totalProjects = SITE_CONFIG.projects.length;
  const totalSlides = totalProjects + 1;
  const step = 1 / (totalSlides - 1);
  const { scrollYProgress: rawWorkProgress } = useScroll({
    target: workSectionRef,
    offset: ["start start", "end end"],
  });
  const workProgress = useSpring(rawWorkProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.005
  });
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  useMotionValueEvent(workProgress, "change", (v) => {
    const idx = Math.round(v * (totalSlides - 1));
    if (idx !== activeWorkIndex) {
      setActiveWorkIndex(idx);
    }
  });
  const x = useTransform(workProgress, [0, 1], ["0vw", `-${(totalSlides - 1) * 100}vw`]);
  const scrollHintOpacity = useTransform(workProgress, [0, 0.15], [0.6, 0]);

  return (
    <div>
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="relative h-screen flex items-center px-6 md:px-12 overflow-hidden"
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
                fontSize: "clamp(42px, 8.5vw, 110px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "var(--rumr-text)",
                lineHeight: 0.84,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <StaggeredText text={"EVERY GREAT\nSTORY STARTS\nAS A"} delay={0.4} />
              <motion.em
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
                className="serif-italic"
                style={{ color: "var(--rumr-green-soft)", display: "inline-block" }}
              >
                RUMR.
              </motion.em>
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
              <div className="flex flex-wrap gap-4 mt-2">
                {/* Primary â€” red showreel */}
                <Link to="/contact">
                  <MagneticButton
                    className="btn-red group"
                    data-cursor="PLAY"
                    style={{
                      padding: "16px 32px",
                      fontSize: "13px",
                      letterSpacing: "0.06em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
                    }
                  >
                    <Play size={14} fill="#fff" />
                    VIEW SHOWREEL
                  </MagneticButton>
                </Link>
                {/* Secondary â€” emerald outline */}
                <Link to="/work">
                  <MagneticButton
                    className="btn-emerald"
                    style={{
                      padding: "16px 32px",
                      fontSize: "13px",
                      letterSpacing: "0.06em",
                    }}
                  >
                    EXPLORE OUR WORK
                    <ArrowRight size={14} />
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.span
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "var(--rumr-text2)",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              Scroll to enter the studio
            </motion.span>

            {/* Mouse Capsule */}
            <div
              style={{
                width: "20px",
                height: "32px",
                borderRadius: "10px",
                border: "1.5px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                justifyContent: "center",
                paddingTop: "6px",
                boxSizing: "border-box",
              }}
            >
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: "3px",
                  height: "6px",
                  borderRadius: "1.5px",
                  backgroundColor: "var(--rumr-green-soft)",
                  boxShadow: "0 0 8px var(--rumr-green-soft)",
                }}
              />
            </div>

            {/* Track line with sliding glow */}
            <div
              style={{
                position: "relative",
                width: "1px",
                height: "50px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{
                  y: ["-100%", "250%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "30%",
                  background: "linear-gradient(to bottom, transparent, var(--rumr-green-soft), transparent)",
                }}
              />
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.35; }
          }
        `}</style>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          BRAND STATEMENT
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="py-36 px-6 md:px-12"
        
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FEATURED WORK â€” SCROLL-JACKED
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        ref={workSectionRef}
        style={{ height: `${totalSlides * 50}vh`, position: "relative" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Stacked Cards Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100vh",
            }}
          >
            {/* Slide 0: Typographic Intro Header */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                paddingLeft: "clamp(2rem, 8vw, 12rem)",
                opacity: useTransform(workProgress, [0, step], [1, 0]),
                scale: useTransform(workProgress, [0, step], [1, 0.9]),
                y: useTransform(workProgress, [0, step], ["0vh", "-10vh"]),
                zIndex: 5,
              }}
            >
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
                <div style={{ marginTop: "2rem" }}>
                  <Link
                    to="/work"
                    className="inline-flex items-center gap-3 group"
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
              </div>
            </motion.div>

            {/* Slide 1 - N: Project Cards */}
            {SITE_CONFIG.projects.map((project, index) => (
              <WorkCard
                key={project.id}
                project={project}
                index={index}
                totalSlides={totalSlides}
                scrollProgress={workProgress}
                onClick={() => navigate(`/work/${project.id}`)}
                isActive={activeWorkIndex === index + 1}
              />
            ))}
          </div>

          {/* Progress dots */}
          <div
            style={{
              position: "absolute",
              bottom: "4rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "row",
              gap: "14px",
              zIndex: 60,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <ProgressDot
                key={index}
                index={index}
                totalSlides={totalSlides}
                scrollProgress={workProgress}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.p
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              x: "-50%",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "var(--rumr-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 10,
              opacity: scrollHintOpacity,
            }}
          >
            Scroll to explore
            <ArrowRight size={12} style={{ transform: "rotate(90deg)" }} />
          </motion.p>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SERVICES
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="py-36 px-6 md:px-12"
        
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
                role="button"
                tabIndex={0}
                className="group py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                style={{
                  borderBottom: "1px solid var(--rumr-border)",
                  transition: "background-color 0.3s ease",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                onClick={() => navigate(`/services#service-${service.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/services#service-${service.id}`);
                  }
                }}
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

      {/* ———————————————————————————————————————————————— 
          PROCESS
      ———————————————————————————————————————————————— */}
      <section
        className="py-36 px-6 md:px-12"
        
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
              <GlowCard
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  borderColor: "var(--rumr-green)",
                  boxShadow: "0 20px 40px -10px rgba(5,75,64,0.3)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="p-8 rounded-xl cursor-default"
                style={{
                  backgroundColor: "var(--rumr-surface)",
                  border: "1px solid var(--rumr-border)",
                }}
              >
                <div className="flex flex-col gap-8 h-full">
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
                    className="mt-auto"
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.65,
                      color: "var(--rumr-text2)",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>


      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          ABOUT TEASER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="py-36 px-6 md:px-12"
        
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
                  data-cursor="ABOUT"
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
                  data-cursor="VIEW"
                  style={{ marginTop: i % 2 === 1 ? "48px" : "0" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ParallaxImage
                    src={src}
                    alt={`BTS ${i + 1}`}
                    className="w-full transition-all duration-700"
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          INSTAGRAM STRIP
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="py-36 px-6 md:px-12"
        
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
                  loading="lazy"
                  decoding="async"
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FINAL CTA
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="py-48 px-6 md:px-12 text-center overflow-hidden"
        
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
              <Link to="/contact">
                <MagneticButton
                  className="btn-red"
                  data-cursor="START"
                  style={{ padding: "20px 48px", fontSize: "15px" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--rumr-red-h)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--rumr-red)")
                  }
                >
                  Start a Project
                </MagneticButton>
              </Link>
              <a href={`mailto:${SITE_CONFIG.brand.email}`}>
                <MagneticButton
                  className="btn-emerald"
                  data-cursor="MAIL"
                  style={{ padding: "20px 48px", fontSize: "15px" }}
                >
                  Email RUMR
                </MagneticButton>
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
