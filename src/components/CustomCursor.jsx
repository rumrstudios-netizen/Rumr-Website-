import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorContent, setCursorContent] = useState("");
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Very tight spring for the main cursor dot
  const springConfig = { damping: 25, stiffness: 300, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      const closestInteractable = target.closest("a, button, [role='button'], [data-cursor]");
      
      if (closestInteractable) {
        setIsHovering(true);
        const dataCursor = closestInteractable.getAttribute("data-cursor");
        if (dataCursor) {
          setCursorContent(dataCursor);
        } else {
          // If it's a link to an external site or standard link
          setCursorContent("arrow"); 
        }
      } else {
        setIsHovering(false);
        setCursorContent("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  // Determine styles based on state
  const size = isHovering && cursorContent !== "arrow" ? 80 : isHovering ? 50 : 16;
  const opacity = 1;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "white",
        color: isHovering ? "var(--rumr-red)" : "black",
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: isHovering ? "normal" : "difference", 
      }}
      animate={{
        width: size,
        height: size,
        opacity,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.3 }}
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
              <ArrowUpRight size={24} strokeWidth={2.5} />
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
