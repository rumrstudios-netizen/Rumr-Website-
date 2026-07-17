import React from "react";

export default function RumrLogo({ className = "", height = 36, useGreen = false }) {
  const src = useGreen ? "/rumr%20logo%20green.png" : "/logo%20rumr.jpg.jpeg";
  return (
    <img
      src={src}
      alt="RUMR"
      className={className}
      style={{
        height: `${height}px`,
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "2px",
      }}
    />
  );
}

export function RumrIcon({ size = 32 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#073a2f",
      }}
    >
      <img
        src="/logo%20rumr.jpg.jpeg"
        alt="R"
        style={{
          height: `${size}px`,
          width: `${size}px`,
          objectFit: "cover",
        }}
      />
    </div>
  );
}
