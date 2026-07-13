import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlobalParticles() {
  const mountRef = useRef(null);

  useEffect(() => {
    let frameId;
    let disposed = false;
    const container = mountRef.current;
    if (!container) return;

    // No antialias needed for particles — big perf win
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 50;

    // Reduced from 600 → 350 particles — visually the same at distance
    const starsCount = 350;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    const colorPalette = [
      new THREE.Color(0xfff5e6), // Warm creamy white (elegant, dominant)
      new THREE.Color(0xfff5e6), // Weighted to appear more frequently
      new THREE.Color(0x48d1ad), // Soft emerald / mint (matches brand green)
      new THREE.Color(0xff3b30), // Soft crimson (matches brand red)
      new THREE.Color(0x8a9296), // Dimmed cool grey for background depth
    ];

    for (let i = 0; i < starsCount; i++) {
      // Spawn stars using spherical distribution
      const r = 30 + Math.random() * 70; // Radius between 30 and 100
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      starsPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starsPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starsPositions[i * 3 + 2] = r * Math.cos(phi);
      
      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starsColors[i * 3] = randomColor.r;
      starsColors[i * 3 + 1] = randomColor.g;
      starsColors[i * 3 + 2] = randomColor.b;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    
    // Smaller canvas texture for particles (16x16 instead of 32x32)
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const pContext = particleCanvas.getContext('2d');
    const pGradient = pContext.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGradient.addColorStop(0, 'rgba(255,255,255,1)');
    pGradient.addColorStop(1, 'rgba(255,255,255,0)');
    pContext.fillStyle = pGradient;
    pContext.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.8,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      vertexColors: true
    });
    
    const starfield = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starfield);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();

    // Throttled pointer tracking — only update every 32ms (~30fps mouse input)
    const pointer = { x: 0, y: 0 };
    let pointerRafPending = false;
    const handlePointerMove = (event) => {
      if (pointerRafPending) return;
      pointerRafPending = true;
      requestAnimationFrame(() => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
        pointerRafPending = false;
      });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    const clock = new THREE.Clock();
    const animate = () => {
      if (disposed) return;
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animate Starfield
      starfield.rotation.y = elapsed * 0.015; // Constant slow drift
      starfield.rotation.x = elapsed * 0.008;
      
      // Add parallax based on mouse
      starfield.position.x += (pointer.x * 2.5 - starfield.position.x) * 0.05;
      starfield.position.y += (-pointer.y * 2.5 - starfield.position.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      
      starsGeometry.dispose();
      starsMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
      }}
      aria-hidden="true"
    />
  );
}
