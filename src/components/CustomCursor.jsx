import React, { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorContent, setCursorContent] = useState("");
  const [visible, setVisible] = useState(false);

  const cursorRef = useRef(null);
  const hoverRef = useRef(false);
  const contentRef = useRef("");
  const visibleRef = useRef(false);

  const pos = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    const checkHoverTarget = (target) => {
      if (!target || typeof target.closest !== "function") {
        if (hoverRef.current) {
          hoverRef.current = false;
          contentRef.current = "";
          setIsHovering(false);
          setCursorContent("");
        }
        return;
      }

      const interactable = target.closest(
        "a, button, [role='button'], [data-cursor], input, select, textarea, label"
      );

      if (interactable) {
        const dataCursor = interactable.getAttribute("data-cursor") || "arrow";
        if (!hoverRef.current || contentRef.current !== dataCursor) {
          hoverRef.current = true;
          contentRef.current = dataCursor;
          setIsHovering(true);
          setCursorContent(dataCursor);
        }
      } else if (hoverRef.current) {
        hoverRef.current = false;
        contentRef.current = "";
        setIsHovering(false);
        setCursorContent("");
      }
    };

    const handleMouseMove = (e) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      if (pos.current.x === -100) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      checkHoverTarget(e.target);
    };

    const handleMouseOver = (e) => {
      checkHoverTarget(e.target);
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const handleMouseEnter = (e) => {
      visibleRef.current = true;
      setVisible(true);
      if (e) {
        pos.current.targetX = e.clientX;
        pos.current.targetY = e.clientY;
      }
    };

    // Ultra-fluid 60FPS position loop with subpixel stabilization
    const loop = () => {
      const p = pos.current;
      if (p.targetX !== -100) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
          p.x = p.targetX;
          p.y = p.targetY;
        } else {
          p.x += dx * 0.45;
          p.y += dy * 0.45;
        }

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        }
      }
      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const size = isHovering ? (cursorContent !== "arrow" ? 76 : 48) : 14;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        willChange: "transform",
      }}
    >
      <div
        className="rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 0.9)",
          color: isHovering ? "var(--rumr-red)" : "#000",
          boxShadow: isHovering
            ? "0 0 20px rgba(255,255,255,0.45)"
            : "0 0 8px rgba(255,255,255,0.25)",
          transition: "width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, box-shadow 0.2s ease",
          willChange: "width, height",
          transform: "translateZ(0)",
        }}
      >
        {isHovering && cursorContent && (
          <div
            className="flex items-center justify-center"
            style={{
              animation: "rumrCursorIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {cursorContent === "arrow" ? (
              <ArrowUpRight size={20} strokeWidth={2.5} />
            ) : (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  paddingLeft: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                {cursorContent}
              </span>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes rumrCursorIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


