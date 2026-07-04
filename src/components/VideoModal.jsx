import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";

/* ── Detect YouTube vs local ── */
function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/shorts\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function isLocalVideo(url) {
  return url && (url.startsWith("/") || url.startsWith("./") || url.startsWith("blob:"));
}

/* ── Format seconds → mm:ss ── */
function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ══════════════════════════════════
   CUSTOM HTML5 PLAYER
══════════════════════════════════ */
function LocalPlayer({ src, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [ended, setEnded] = useState(false);

  /* Auto-play on mount */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  /* Keyboard controls */
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      if (e.key === "m") toggleMute();
      if (e.key === "f") toggleFullscreen();
      if (e.key === "ArrowRight") seek(5);
      if (e.key === "ArrowLeft") seek(-5);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [playing, muted]);

  /* Auto-hide controls */
  const showControlsTemporary = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2800);
  }, [playing]);

  useEffect(() => {
    if (!playing) setShowControls(true);
    else showControlsTemporary();
    return () => clearTimeout(hideTimer.current);
  }, [playing]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (ended) { v.currentTime = 0; setEnded(false); }
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function seek(delta) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }

  function handleProgress(e) {
    const v = videoRef.current;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
  }

  function onTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100 || 0);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100 || 0);
    }
  }

  /* Detect Shorts-like vertical video after metadata loads */
  const [isVertical, setIsVertical] = useState(false);
  function onMetadata() {
    const v = videoRef.current;
    setDuration(v.duration);
    setIsVertical(v.videoHeight > v.videoWidth);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={showControlsTemporary}
      onClick={togglePlay}
      style={{
        position: "relative",
        width: isVertical ? "min(380px, 85vw)" : "min(960px, 90vw)",
        aspectRatio: isVertical ? "9 / 16" : "16 / 9",
        maxHeight: "85vh",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#000",
        boxShadow: "0 0 0 1px rgba(11,117,98,0.25), 0 30px 90px rgba(0,0,0,0.7)",
        cursor: showControls ? "default" : "none",
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onMetadata}
        onEnded={() => { setPlaying(false); setEnded(true); setShowControls(true); }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
      />

      {/* Big play/replay in centre when paused */}
      <AnimatePresence>
        {(!playing) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              backgroundColor: "var(--rumr-red)",
              boxShadow: "0 0 40px rgba(255,59,48,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {ended
                ? <RotateCcw size={28} color="#fff" />
                : <Play size={30} fill="#fff" color="#fff" style={{ marginLeft: "4px" }} />
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 45%)",
              padding: "0 20px 18px",
            }}
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              onClick={handleProgress}
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "2px",
                marginBottom: "14px",
                position: "relative",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.height = "6px")}
              onMouseLeave={(e) => (e.currentTarget.style.height = "4px")}
            >
              {/* Buffered */}
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${buffered}%`,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
              }} />
              {/* Played */}
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${progress}%`,
                backgroundColor: "var(--rumr-red)",
                borderRadius: "2px",
                transition: "width 0.1s linear",
              }}>
                <div style={{
                  position: "absolute", right: "-5px", top: "50%",
                  transform: "translateY(-50%)",
                  width: "10px", height: "10px", borderRadius: "50%",
                  backgroundColor: "#fff",
                  boxShadow: "0 0 6px rgba(255,59,48,0.6)",
                }} />
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Play/Pause */}
              <button onClick={togglePlay} style={btnStyle}>
                {playing ? <Pause size={16} fill="#fff" color="#fff" /> : <Play size={16} fill="#fff" color="#fff" />}
              </button>

              {/* Time */}
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: "monospace", flexShrink: 0 }}>
                {fmt(currentTime)} / {fmt(duration)}
              </span>

              <div style={{ flex: 1 }} />

              {/* Volume */}
              <button onClick={toggleMute} style={btnStyle}>
                {muted || volume === 0
                  ? <VolumeX size={16} color="#fff" />
                  : <Volume2 size={16} color="#fff" />}
              </button>

              {/* Volume slider */}
              <input
                type="range" min={0} max={1} step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = videoRef.current;
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (v) v.volume = val;
                  if (val > 0 && muted) { setMuted(false); if (v) v.muted = false; }
                }}
                style={{ width: "70px", accentColor: "var(--rumr-red)", cursor: "pointer" }}
              />

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} style={btnStyle}>
                {fullscreen ? <Minimize size={16} color="#fff" /> : <Maximize size={16} color="#fff" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const btnStyle = {
  background: "none", border: "none", padding: "6px",
  cursor: "pointer", display: "flex", alignItems: "center",
  justifyContent: "center", borderRadius: "6px",
  transition: "background 0.2s",
};

/* ══════════════════════════════════
   YOUTUBE FALLBACK (stripped)
══════════════════════════════════ */
function YouTubePlayer({ url }) {
  const videoId = getYouTubeId(url);
  const isShort = /youtube\.com\/shorts\//.test(url);
  if (!videoId) return null;
  return (
    <div style={{
      width: isShort ? "min(380px, 85vw)" : "min(960px, 90vw)",
      aspectRatio: isShort ? "9 / 16" : "16 / 9",
      maxHeight: "85vh",
      borderRadius: "16px",
      overflow: "hidden",
      backgroundColor: "#000",
      boxShadow: "0 0 0 1px rgba(11,117,98,0.25), 0 30px 90px rgba(0,0,0,0.7)",
    }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&showinfo=0&iv_load_policy=3&fs=0&playsinline=1`}
        title="Video Player"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}

/* ══════════════════════════════════
   MODAL WRAPPER
══════════════════════════════════ */
export default function VideoModal({ videoUrl, onClose }) {
  const local = isLocalVideo(videoUrl);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        cursor: "pointer",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "20px", right: "20px",
          width: "44px", height: "44px", borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          backgroundColor: "rgba(255,255,255,0.06)",
          color: "#fff", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", zIndex: 10,
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--rumr-red)";
          e.currentTarget.style.borderColor = "var(--rumr-red)";
          e.currentTarget.style.transform = "rotate(90deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "rotate(0)";
        }}
      >
        <X size={18} />
      </button>

      {/* Player */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {local
          ? <LocalPlayer src={videoUrl} onClose={onClose} />
          : <YouTubePlayer url={videoUrl} />
        }
      </motion.div>

      {/* Hint */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "absolute", bottom: "20px",
          fontSize: "10px", textTransform: "uppercase",
          letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)",
          pointerEvents: "none",
        }}
      >
        ESC or click outside to close · Space to play/pause
      </motion.span>
    </motion.div>
  );
}
