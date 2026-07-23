import React, { useEffect, useRef } from "react";

/*
  CosmicDust — High-performance canvas particle field.
  Optimized with zero shadowBlur, smooth physics, and visibility-aware animation loop.
*/
export default function CosmicDust({
  particleCount = 160,
  speedMultiplier = 1.0,
  particleSize = 1.2,
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
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

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

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    let mouseRafPending = false;
    const handleMouseMove = (e) => {
      if (mouseRafPending) return;
      mouseRafPending = true;
      requestAnimationFrame(() => {
        mouseRef.current.targetX = e.clientX;
        mouseRef.current.targetY = e.clientY;
        mouseRef.current.hasMoved = true;
        mouseRafPending = false;
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastTime = performance.now();

    const animate = (t) => {
      if (!isVisible) return;
      animationId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, width, height);

      if (!mouseRef.current.hasMoved) {
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.15;
        mouseRef.current.targetX = cx + Math.cos(t * 0.001) * radius;
        mouseRef.current.targetY = cy + Math.sin(t * 0.001) * radius;
      }

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      for (let index = 0; index < particles.length; index++) {
        const p = particles[index];
        p.vx += Math.sin(t * 0.002 + index) * 0.02 * speedMultiplier;

        const dx = mX - p.x;
        const dY = mY - p.y;
        const distSq = dx * dx + dY * dY;
        const influenceRadius = 180;
        const influenceRadiusSq = influenceRadius * influenceRadius;

        if (distSq < influenceRadiusSq) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1.0 - dist / influenceRadius) * 0.8 * speedMultiplier;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dY / dist) * force * 0.04;

          const tx = -dY / dist;
          const ty = dx / dist;
          p.vx += tx * force * 0.18;
          p.vy += ty * force * 0.18;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 5) p.history.shift();

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[index] = createParticle(false);
          continue;
        }

        // Draw particle trail (clean lines without glow filters)
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let i = 1; i < p.history.length; i++) {
            ctx.lineTo(p.history[i].x, p.history[i].y);
          }
          ctx.strokeStyle = `${p.color}${p.opacity * 0.3})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();
        }

        // Draw core particle (NO expensive shadowBlur)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}

