import React from "react";

export default function RumrLogo({ className = "", height = 36, fill = "currentColor", showTagline = false }) {
  const viewBoxHeight = showTagline ? 78 : 62;
  const logoHeight = showTagline ? height * (78 / 62) : height;

  return (
    <svg
      viewBox={`0 0 128 ${viewBoxHeight}`}
      height={logoHeight}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Letter R */}
      <path
        d="M 0,0 L 14,0 C 19.5,0 22,3.5 22,13.5 C 22,23.5 19.5,27 14,27 L 5.5,27 L 5.5,60 L 0,60 Z M 5.5,5.5 L 13.5,5.5 C 16.5,5.5 16.5,7.5 16.5,13.5 C 16.5,19.5 16.5,21.5 13.5,21.5 L 5.5,21.5 Z"
        fill={fill}
      />
      <path
        d="M 10,27 L 16.5,27 L 23.5,60 L 17,60 Z"
        fill={fill}
      />

      {/* Middle Glyph U/x/C */}
      {/* Top Arch */}
      <path
        d="M 30,16 C 30,4 52,4 52,16 L 46.5,16 C 46.5,9.5 35.5,9.5 35.5,16 Z"
        fill={fill}
      />
      {/* Cross X */}
      <path
        d="M 33.5,22 L 48.5,35 L 44.5,38 L 29.5,25 Z"
        fill={fill}
      />
      <path
        d="M 48.5,22 L 33.5,35 L 37.5,38 L 52.5,25 Z"
        fill={fill}
      />
      {/* Bottom Arch */}
      <path
        d="M 30,41 C 30,53 52,53 52,41 L 46.5,41 C 46.5,47.5 35.5,47.5 35.5,41 Z"
        fill={fill}
      />
      {/* STUDIOS Text */}
      <text
        x="41"
        y="58"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="7.8"
        letterSpacing="0.04em"
        textAnchor="middle"
        fill={fill}
      >
        STUDIOS
      </text>

      {/* Letter M */}
      <rect x="60" y="0" width="5.5" height="60" fill={fill} />
      <rect x="76.5" y="0" width="5.5" height="60" fill={fill} />
      <path
        d="M 65.5,0 L 71,28 L 71,28 L 76.5,0 L 82,0 L 73.75,34 L 68.25,34 L 60,0 Z"
        fill={fill}
      />

      {/* Letter Я (Backwards R) */}
      <path
        d="M 112,0 L 98,0 C 92.5,0 90,3.5 90,13.5 C 90,23.5 92.5,27 98,27 L 106.5,27 L 106.5,60 L 112,60 Z M 106.5,5.5 L 98.5,5.5 C 95.5,5.5 95.5,7.5 95.5,13.5 C 95.5,19.5 95.5,21.5 98.5,21.5 L 106.5,21.5 Z"
        fill={fill}
      />
      <path
        d="M 102,27 L 95.5,27 L 88.5,60 L 95,60 Z"
        fill={fill}
      />

      {/* Dot . */}
      <circle cx="122.5" cy="57" r="3.2" fill={fill} />

      {/* Optional Tagline */}
      {showTagline && (
        <text
          x="61"
          y="72"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="600"
          fontSize="5.2"
          letterSpacing="0.43em"
          textAnchor="middle"
          fill={fill}
        >
          RISE UP MAKE REALITY
        </text>
      )}
    </svg>
  );
}
