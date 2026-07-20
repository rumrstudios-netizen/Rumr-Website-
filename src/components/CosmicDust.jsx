import React, { useEffect, useRef, useState } from "react";

/*
  CosmicDust — adapted from Lightswind UI.
  Canvas-based particle field with mouse-reactive vortex physics.
  Replaces the Three.js GlobalParticles with a lighter, more interactive effect.
*/
export default function CosmicDust({
  particleCount = 120,
  speedMultiplier = 1.0,
  particleSize = 1.5,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    hasMoved: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    // Rumr brand palette — emerald / red / warm cream
    const colors = [
      "rgba(72, 209, 173,",   // emerald / mint (brand green)
      "rgba(255, 59, 48,",    // crimson (brand red)
      "rgba(255, 245, 230,",  // warm creamy white
      "rgba(138, 146, 150,",  // cool grey depth
    ];

    const createParticle = (initRandom = false) => {
      const pX = Math.random() * width;
      const pY = initRandom ? Math.random() * height : height + 10;
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        x: pX,
        y: pY,
        vx: (Math.random() - 0.5) * 1.2 * speedMultiplier,
        vy: (-Math.random() - 0.2) * 1.5 * speedMultiplier,
        size: (Math.random() * 0.8 + 0.6) * particleSize,
        color: baseColor,
        opacity: Math.random() * 0.4 + 0.4,
        history: [],
      };
    };

    let particles = Array.from({ length: particleCount }, () =>
      createParticle(true)
    );

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.hasMoved = true;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = (t) => {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      // Idle orbit when no mouse input
      if (!mouseRef.current.hasMoved) {
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.15;
        mouseRef.current.targetX = cx + Math.cos(t * 0.001) * radius;
        mouseRef.current.targetY = cy + Math.sin(t * 0.001) * radius;
      }

      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      particles.forEach((p, index) => {
        // Natural drift
        p.vx += Math.sin(t * 0.002 + index) * 0.02 * speedMultiplier;

        // Mouse vortex interaction
        const dx = mX - p.x;
        const dY = mY - p.y;
        const dist = Math.sqrt(dx * dx + dY * dY);
        const influenceRadius = 180;

        if (dist < influenceRadius) {
          const force =
            (1.0 - dist / influenceRadius) * 0.8 * speedMultiplier;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dY / dist) * force * 0.04;

          // Tangential swirl
          const tx = -dY / dist;
          const ty = dx / dist;
          p.vx += tx * force * 0.18;
          p.vy += ty * force * 0.18;
        }

        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Trail history
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 6) p.history.shift();

        // Reset if offscreen
        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[index] = createParticle(false);
          return;
        }

        // Draw trail
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let i = 1; i < p.history.length; i++) {
            ctx.lineTo(p.history[i].x, p.history[i].y);
          }
          ctx.strokeStyle = `${p.color}${p.opacity * 0.35})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Draw particle core with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowBlur = 5;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [particleCount, speedMultiplier, particleSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
