import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

/*
  ThreeDHoverGallery — adapted from Lightswind UI.
  Expandable gallery with 3D perspective tilt on hover.
  Each item expands to reveal title/category/description.
*/
export default function ThreeDHoverGallery({
  items = [],
  itemHeight = 400,
  gap = 8,
  perspective = 1000,
  hoverScale = 1.05,
}) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div
      style={{ width: "100%", overflow: "hidden", padding: "8px 0" }}
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          perspective: `${perspective}px`,
          transformStyle: "preserve-3d",
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              onMouseEnter={() => setActiveIndex(index)}
              layout
              animate={{
                rotateY:
                  activeIndex === null
                    ? 0
                    : index < activeIndex
                    ? 24
                    : index > activeIndex
                    ? -24
                    : 0,
              }}
              transition={{
                layout: { type: "spring", stiffness: 100, damping: 17 },
                rotateY: { type: "spring", stiffness: 90, damping: 15 },
              }}
              style={{
                height:
                  typeof itemHeight === "number"
                    ? `${itemHeight}px`
                    : itemHeight,
                zIndex: isActive ? 20 : 10,
                flex: isActive ? 5.8 : 1,
                minWidth: isActive ? "280px" : "60px",
                transformStyle: "preserve-3d",
                position: "relative",
                cursor: "pointer",
                userSelect: "none",
                overflow: "hidden",
                borderRadius: "16px",
                border: isActive
                  ? "1px solid rgba(11,117,98,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                filter: isActive
                  ? "grayscale(0%) brightness(1)"
                  : activeIndex === null
                  ? "grayscale(25%) brightness(0.8)"
                  : "grayscale(100%) brightness(0.35)",
                transition: "filter 0.3s ease, border-color 0.3s ease",
              }}
            >
              {/* Glow border when active */}
              {isActive && item.glow && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    borderRadius: "16px",
                    boxShadow: `inset 0 0 20px ${item.glow}, 0 0 15px ${item.glow}`,
                    zIndex: 10,
                    transition: "all 0.5s ease",
                  }}
                />
              )}

              {/* Background image */}
              <motion.div
                animate={{ scale: isActive ? hoverScale : 1.0 }}
                transition={{ duration: 0.5, ease: [0.1, 0.7, 0, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${item.url || item.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isActive
                    ? "linear-gradient(to top, rgba(9,11,11,0.9) 0%, rgba(9,11,11,0.4) 40%, rgba(9,11,11,0.1) 70%, transparent 100%)"
                    : "linear-gradient(to top, rgba(9,11,11,0.6) 0%, transparent 50%)",
                  zIndex: 2,
                  transition: "opacity 0.3s ease",
                }}
              />

              {/* Content overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "20px",
                  zIndex: 4,
                  color: "#fff",
                  overflow: "hidden",
                }}
              >
                <AnimatePresence>
                  {isActive && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      {/* Category */}
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--rumr-green-soft)",
                          marginBottom: "4px",
                        }}
                      >
                        {item.category}
                      </motion.span>

                      {/* Title */}
                      <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={{
                          fontSize: "clamp(16px, 2vw, 22px)",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          textTransform: "uppercase",
                          lineHeight: 1.1,
                          marginBottom: "6px",
                          color: "var(--rumr-text)",
                        }}
                      >
                        {item.title || item.label}
                      </motion.h4>

                      {/* Description (if provided) */}
                      {item.description && (
                        <motion.p
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 0.7, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                          style={{
                            fontSize: "11px",
                            lineHeight: 1.5,
                            color: "var(--rumr-text2)",
                            maxWidth: "280px",
                          }}
                        >
                          {item.description}
                        </motion.p>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
