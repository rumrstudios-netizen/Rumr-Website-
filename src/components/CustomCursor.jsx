import React, { useEffect, useRef, useState, useCallback } from "react";

/*
  Custom cursor using raw DOM manipulation instead of Framer Motion springs.
  This eliminates constant React re-renders that were causing jank.
  The cursor now updates via direct style mutations in a rAF loop.
*/
export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouchDevice);
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== "function") return;
      
      const tagName = target.tagName;
      if (tagName === "A" || tagName === "BUTTON") {
        hovering.current = true;
        return;
      }
      
      hovering.current = !!target.closest("a, button, [role='button'], .cursor-pointer");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Smooth follow loop — updates DOM directly, no React re-renders
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.18);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.18);

      const x = pos.current.x;
      const y = pos.current.y;
      const isHover = hovering.current;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3.5}px, ${y - 3.5}px, 0) scale(${isHover ? 0 : 1})`;
        dotRef.current.style.opacity = isHover ? "0" : "1";
      }
      if (ringRef.current) {
        const size = isHover ? 44 : 28;
        ringRef.current.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.opacity = isHover ? "1" : "0.55";
      }

      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor dot — hot red */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "#FF3B30",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "opacity 0.15s ease",
        }}
      />
      {/* Outer ring — emerald, expands on hover */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1px solid rgba(11,117,98,0.5)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
        }}
      />
    </>
  );
}
