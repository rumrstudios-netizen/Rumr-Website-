import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function ParallaxImage({ src, alt, className = "", style = {}, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  // Image moves from -15% to 15% vertically relative to container
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          y,
          scale: 1.15, // Scale up to hide edges during parallax
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          ...style
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
