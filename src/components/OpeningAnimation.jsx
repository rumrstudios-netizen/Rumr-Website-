import React, { useEffect, useRef, useState } from "react";

/**
 * OpeningAnimation
 * ─────────────────────────────────────────────────────────
 * A high-end cinematic studio intro:
 *   1) Dark Slate & Anamorphic Lens Flare (0-600ms)
 *   2) EVF Camera Viewfinder HUD Calibration (600-2400ms)
 *   3) Brand Focus & Lens Aperture Lock (2400-3800ms)
 *   4) Shutter Flash Burst (3800-4100ms)
 *   5) Cinematic Iris Reveal into Site (4100-5600ms)
 *
 * Skips gracefully if prefers-reduced-motion or already played in session.
 */

const STORAGE_KEY = "rumr_intro_played";

// Timings in milliseconds
const T_FADE_IN = 500;
const T_HUD = 1900;
const T_FOCUS = 1400;
const T_SHUTTER = 260;
const T_REVEAL = 1400;
const SKIP_APPEARS_AT = 600;

export default function OpeningAnimation({ onDone }) {
  const alreadyPlayed =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(STORAGE_KEY) === "1";

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phase, setPhase] = useState(
    alreadyPlayed || prefersReducedMotion ? "done" : "fade-in"
  );
  const [showSkip, setShowSkip] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const timers = useRef([]);

  const finish = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      /* ignore */
    }
    document.body.style.overflow = "";
    setPhase("done");
    onDone && onDone();
  };

  useEffect(() => {
    if (alreadyPlayed || prefersReducedMotion) {
      onDone && onDone();
      return;
    }

    document.body.style.overflow = "hidden";

    // Sequence timing
    let t = T_FADE_IN;
    timers.current.push(setTimeout(() => setPhase("hud"), t));
    
    t += T_HUD;
    timers.current.push(setTimeout(() => setPhase("focus"), t));
    
    t += T_FOCUS;
    timers.current.push(setTimeout(() => setPhase("shutter"), t));
    
    t += T_SHUTTER;
    timers.current.push(setTimeout(() => setPhase("reveal"), t));
    
    t += T_REVEAL;
    timers.current.push(setTimeout(finish, t));

    timers.current.push(setTimeout(() => setShowSkip(true), SKIP_APPEARS_AT));

    return () => {
      timers.current.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timecode readout (24fps timecode: MM:SS:FF:SF)
  useEffect(() => {
    if (phase !== "hud" && phase !== "focus") return;
    if (!startRef.current) startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const totalSec = elapsed / 1000;
      const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
      const ss = String(Math.floor(totalSec % 60)).padStart(2, "0");
      const ff = String(Math.floor((elapsed % 1000) / 41.6)).padStart(2, "0");
      const sub = String(Math.floor((elapsed % 41.6) / 4.16)).padStart(2, "0");
      setTimecode(`${mm}:${ss}:${ff}:${sub}`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`rumr-intro rumr-intro--${phase}`}
      role="presentation"
      aria-hidden="true"
    >
      {/* Base dark backdrop + iris reveal mask */}
      <div className="rumr-intro__mask" />

      {/* Horizontal Anamorphic Flare */}
      <div className="rumr-intro__anamorphic-flare" />

      {/* Camera Viewfinder HUD */}
      <div className="rumr-intro__hud">
        <div className="rumr-intro__vignette" />
        <div className="rumr-intro__scanline" />

        {/* Viewfinder corner framing */}
        <span className="rumr-intro__corner rumr-intro__corner--tl" />
        <span className="rumr-intro__corner rumr-intro__corner--tr" />
        <span className="rumr-intro__corner rumr-intro__corner--bl" />
        <span className="rumr-intro__corner rumr-intro__corner--br" />

        {/* Header HUD: REC status, 8K indicator, live timecode */}
        <div className="rumr-intro__topbar">
          <div className="rumr-intro__rec">
            <span className="rumr-intro__rec-dot" />
            REC [STANDBY]
          </div>
          <div className="rumr-intro__timecode">{timecode}</div>
          <div className="rumr-intro__badge">8K 12-BIT RAW</div>
        </div>

        {/* Center Focus Target & Rangefinder Ring */}
        <div className="rumr-intro__reticle">
          <div className="rumr-intro__reticle-ring" />
          <span className="rumr-intro__reticle-tick rumr-intro__reticle-tick--t" />
          <span className="rumr-intro__reticle-tick rumr-intro__reticle-tick--r" />
          <span className="rumr-intro__reticle-tick rumr-intro__reticle-tick--b" />
          <span className="rumr-intro__reticle-tick rumr-intro__reticle-tick--l" />
          <div className="rumr-intro__focus-text">AF-C LOCK</div>
        </div>

        {/* Studio Branding */}
        <div className="rumr-intro__brand">
          <div className="rumr-intro__wordmark">RUMR STUDIOS</div>
          <div className="rumr-intro__tagline">CINEMATIC & DIGITAL EXPERIENCES</div>
        </div>

        {/* Footer Technical Readouts */}
        <div className="rumr-intro__readouts">
          <span>24.00 FPS</span>
          <span>f/1.4</span>
          <span>ISO 800</span>
          <span>35MM ANAMORPHIC</span>
          <span>5600K</span>
        </div>
      </div>

      {/* Shutter Burst Flash */}
      <div className="rumr-intro__flash" />

      {/* Skip Button */}
      {showSkip && phase !== "shutter" && phase !== "reveal" && (
        <button
          type="button"
          className="rumr-intro__skip"
          onClick={finish}
        >
          <span>SKIP INTRO</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

