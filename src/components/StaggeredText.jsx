import React from "react";
import { motion } from "motion/react";

export default function StaggeredText({ text, className = "", delay = 0 }) {
  const lines = text.split("\n");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i },
    }),
  };

  const child = {
    hidden: { y: "110%", opacity: 0, rotateZ: 2 },
    visible: {
      y: "0%",
      opacity: 1,
      rotateZ: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        mass: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col ${className}`}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          style={{ overflow: "hidden", display: "inline-block" }}
        >
          <motion.div
            variants={child}
            style={{ display: "inline-block", transformOrigin: "left center" }}
          >
            {line === "" ? "\u00A0" : line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
