import React from "react";
import { motion } from "motion/react";

/*
  BorderBeam — adapted from Lightswind UI.
  Animated beam of light that traverses a container's border.
  Wrap it inside a position:relative container.
*/
export default function BorderBeam({
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "rgba(11, 117, 98, 1)",
  colorTo = "rgba(255, 59, 48, 0.8)",
  reverse = false,
  initialOffset = 0,
  className = "",
}) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        border: "1px solid transparent",
        pointerEvents: "none",
        maskClip: "padding-box, border-box",
        WebkitMaskClip: "padding-box, border-box",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        maskImage:
          "linear-gradient(transparent, transparent), linear-gradient(#000, #000)",
        WebkitMaskImage:
          "linear-gradient(transparent, transparent), linear-gradient(#000, #000)",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          aspectRatio: "1 / 1",
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
        }}
      />
    </div>
  );
}
