import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorContent, setCursorContent] = useState("");
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const hoverRef = useRef(false);
  const contentRef = useRef("");

  // Optimized spring config for fluid responsiveness
  const springConfig = { damping: 28, stiffness: 350, mass: 0.15 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let mouseRafPending = false;

    const handleMouseMove = (e) => {
      if (mouseRafPending) return;
      mouseRafPending = true;
      requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        mouseRafPending = false;
      });
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      const closestInteractable = target?.closest?.("a, button, [role='button'], [data-cursor]");
      
      if (closestInteractable) {
        const dataCursor = closestInteractable.getAttribute("data-cursor") || "arrow";
        if (!hoverRef.current || contentRef.current !== dataCursor) {
          hoverRef.current = true;
          contentRef.current = dataCursor;
          setIsHovering(true);
          setCursorContent(dataCursor);
        }
      } else {
        if (hoverRef.current) {
          hoverRef.current = false;
          contentRef.current = "";
          setIsHovering(false);
          setCursorContent("");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const size = isHovering && cursorContent !== "arrow" ? 80 : isHovering ? 50 : 16;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: isHovering ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.9)",
        color: isHovering ? "var(--rumr-red)" : "black",
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        boxShadow: isHovering
          ? "0 0 20px rgba(255,255,255,0.4)"
          : "0 0 10px rgba(255,255,255,0.2)",
        willChange: "transform",
      }}
      animate={{
        width: size,
        height: size,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isHovering && cursorContent && (
          <motion.div
            key={cursorContent}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            {cursorContent === "arrow" ? (
              <ArrowUpRight size={22} strokeWidth={2.5} />
            ) : (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  paddingLeft: "2px"
                }}
              >
                {cursorContent}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

