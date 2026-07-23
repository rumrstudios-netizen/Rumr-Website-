import React from "react";

export default function RumrLogo({ className = "", height = 36, useGreen = false, src: customSrc }) {
  const src = customSrc || (useGreen ? "/rumr%20logo%20green.png" : "/logo%20rumr.jpg.jpeg");
  return (
    <img
      src={src}
      alt="RUMR"
      className={className}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "2px",
        objectFit: "contain",
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
