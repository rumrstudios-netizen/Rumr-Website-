import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function MagneticButton({
  children,
  className = "",
  style = {},
  strength = 30,
  innerStrength = 15,
  ...props
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const innerX = useTransform(smoothX, (v) => v * (innerStrength / strength));
  const innerY = useTransform(smoothY, (v) => v * (innerStrength / strength));

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * (strength / 100));
    y.set((clientY - centerY) * (strength / 100));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMouseMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handleMouseLeave}
      style={{
        x: smoothX,
        y: smoothY,
        ...style,
      }}
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      {...props}
    >
      <motion.span
        style={{
          x: innerX,
          y: innerY,
        }}
        className="pointer-events-none flex items-center justify-center gap-2"
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
