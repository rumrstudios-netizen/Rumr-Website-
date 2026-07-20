import React, { useCallback, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export default function GlowCard({
  children,
  className = "",
  style = {},
  gradientSize = 300,
  gradientColor = "rgba(72, 209, 173, 0.12)", // Subtle RUMR green
  ...props
}) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);
  const containerRef = useRef(null);

  const handlePointerMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handlePointerLeave = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [mouseX, mouseY, gradientSize]);

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </motion.div>
  );
}
