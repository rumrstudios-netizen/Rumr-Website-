import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/*
  Rumr Studios — Sony camera hero.
  Loads the model from /camera.glb (extracted from the original embedded version)
  so Babel can actually parse and compile this file efficiently.
*/

// Local coordinates of the cap on the supplied Sony camera mesh.
const LENS_CAP = {
  centerX: 2.2,
  centerY: 8.0,
  zMin: 11.0,
  zMax: 12.5,
  radius: 7.45,
};

function disposeObject(root) {
  root?.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => {
      if (!material) return;
      material.dispose?.();
    });
  });
}

function disposeScene(scene) {
  scene?.traverse((object) => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => material?.dispose?.());
  });
}

function prepareTexture(texture, { srgb = false } = {}) {
  if (!texture) return;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.max(texture.anisotropy || 1, 8);
  texture.needsUpdate = true;
}

function cloneToPhysicalMaterial(source) {
  if (!source) return source;

  const standard = new THREE.MeshStandardMaterial({
    name: `${source.name || "Sony camera"} — standard PBR`,
    color: source.color?.clone?.() || new THREE.Color(0x141618),
    map: source.map || null,
    lightMap: source.lightMap || null,
    aoMap: source.aoMap || null,
    emissive: source.emissive?.clone?.() || new THREE.Color(0x000000),
    emissiveMap: source.emissiveMap || null,
    emissiveIntensity: source.emissiveIntensity ?? 1,
    bumpMap: source.bumpMap || null,
    normalMap: source.normalMap || null,
    normalMapType: source.normalMapType,
    displacementMap: source.displacementMap || null,
    displacementScale: source.displacementScale ?? 1,
    displacementBias: source.displacementBias ?? 0,
    roughness: Math.min(0.68, Math.max(0.24, source.roughness ?? 0.42)),
    roughnessMap: source.roughnessMap || null,
    metalness: Math.min(0.8, Math.max(0.1, source.metalness ?? 0.24)),
    metalnessMap: source.metalnessMap || null,
    alphaMap: source.alphaMap || null,
    transparent: Boolean(source.transparent),
    opacity: source.opacity ?? 1,
    side: source.side ?? THREE.FrontSide,
    depthFunc: source.depthFunc,
    depthTest: source.depthTest,
    depthWrite: source.depthWrite,
    alphaTest: source.alphaTest ?? 0,
  });

  prepareTexture(standard.map, { srgb: true });
  prepareTexture(standard.lightMap);
  prepareTexture(standard.aoMap);
  prepareTexture(standard.emissiveMap, { srgb: true });
  prepareTexture(standard.bumpMap);
  prepareTexture(standard.normalMap);
  prepareTexture(standard.displacementMap);
  prepareTexture(standard.roughnessMap);
  prepareTexture(standard.metalnessMap);
  prepareTexture(standard.alphaMap);

  if (source.normalScale && standard.normalScale) {
    standard.normalScale.copy(source.normalScale).multiplyScalar(0.94);
  }
  if (source.bumpScale !== undefined) standard.bumpScale = source.bumpScale * 0.9;
  standard.aoMapIntensity = Math.max(source.aoMapIntensity ?? 1, 1.18);
  if (source.lightMapIntensity !== undefined)
    standard.lightMapIntensity = source.lightMapIntensity;

  standard.envMapIntensity = 1.8;
  standard.needsUpdate = true;
  return standard;
}

function upgradeCameraMaterials(root) {
  root.traverse((object) => {
    if (!object.isMesh || !object.material) return;
    const sourceMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    const premiumMaterials = sourceMaterials.map((source) => {
      const material = cloneToPhysicalMaterial(source);
      source?.dispose?.();
      return material;
    });
    object.material = Array.isArray(object.material)
      ? premiumMaterials
      : premiumMaterials[0];
  });
}

function createLensCoatingTexture() {
  // Reduced from 1024 → 512 — still looks great on lens
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    fallback.needsUpdate = true;
    return fallback;
  }

  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  const drawSoftbox = (x, y, w, h, rotation, rgbaCore, rgbaEdge, blur, alpha = 1) => {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = alpha;
    context.shadowColor = rgbaCore;
    context.shadowBlur = blur;
    const gradient = context.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
    gradient.addColorStop(0, rgbaEdge);
    gradient.addColorStop(0.18, rgbaCore);
    gradient.addColorStop(0.82, rgbaCore);
    gradient.addColorStop(1, rgbaEdge);
    context.fillStyle = gradient;
    context.beginPath();
    context.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * 0.16);
    context.fill();
    context.restore();
  };

  // Scale factor for 512 vs 1024
  const s = 0.5;

  const edgeTint = context.createRadialGradient(260 * s * 2, 268 * s * 2, 58 * s * 2, 256, 256, 235);
  edgeTint.addColorStop(0, "rgba(0, 0, 0, 0)");
  edgeTint.addColorStop(0.58, "rgba(7, 17, 22, 0.02)");
  edgeTint.addColorStop(0.82, "rgba(10, 24, 30, 0.08)");
  edgeTint.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = edgeTint;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalCompositeOperation = "screen";

  drawSoftbox(174, 145, 69, 160, -0.42, "rgba(255,255,250,0.60)", "rgba(255,255,250,0.00)", 13, 0.95);
  drawSoftbox(338, 194, 39, 112, 0.27, "rgba(244,250,255,0.30)", "rgba(244,250,255,0.00)", 9, 0.82);

  const glint = context.createRadialGradient(204, 117, 0, 204, 117, 39);
  glint.addColorStop(0, "rgba(255,255,255,0.68)");
  glint.addColorStop(0.22, "rgba(255,255,255,0.28)");
  glint.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glint;
  context.beginPath();
  context.ellipse(204, 117, 31, 26, -0.18, 0, Math.PI * 2);
  context.fill();

  const coating = context.createRadialGradient(306, 306, 0, 306, 306, 110);
  coating.addColorStop(0, "rgba(98, 214, 178, 0.16)");
  coating.addColorStop(0.32, "rgba(44, 125, 110, 0.10)");
  coating.addColorStop(0.68, "rgba(44, 86, 124, 0.06)");
  coating.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = coating;
  context.beginPath();
  context.ellipse(306, 306, 101, 86, 0.18, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.ellipse(264, 257, 185, 162, -0.3, 3.72, 5.2);
  context.strokeStyle = "rgba(255,246,232,0.13)";
  context.lineWidth = 6;
  context.shadowColor = "rgba(255,248,236,0.08)";
  context.shadowBlur = 5;
  context.stroke();

  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

// Segment counts tuned for performance
const SEGMENTS_HIGH = 48;
const SEGMENTS_MED = 32;
const SEGMENTS_LOW = 16;

function createPremiumLensAssembly() {
  const lens = new THREE.Group();
  lens.name = "Rumr premium optical lens";

  const outerRadius = LENS_CAP.radius * 0.765;
  const glassRadius = LENS_CAP.radius * 0.675;
  const frontZ = LENS_CAP.zMax + 0.04;
  lens.position.set(LENS_CAP.centerX, LENS_CAP.centerY, frontZ);

  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0d0e,
    metalness: 0.55,
    roughness: 0.38,
    envMapIntensity: 1.5,
  });
  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: 0x050708,
    metalness: 0.12,
    roughness: 0.72,
    envMapIntensity: 0.8,
  });
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x7e8985,
    metalness: 0.85,
    roughness: 0.22,
    envMapIntensity: 1.8,
  });

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(outerRadius, outerRadius * 0.982, 0.48, SEGMENTS_HIGH, 1, true),
    barrelMaterial
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = -0.18;
  lens.add(barrel);

  const frontBevel = new THREE.Mesh(
    new THREE.TorusGeometry(outerRadius * 0.978, outerRadius * 0.04, 12, SEGMENTS_HIGH),
    barrelMaterial
  );
  frontBevel.position.z = 0.004;
  lens.add(frontBevel);

  const engravingRing = new THREE.Mesh(
    new THREE.TorusGeometry(outerRadius * 0.845, outerRadius * 0.012, 8, SEGMENTS_HIGH),
    metalMaterial
  );
  engravingRing.position.z = 0.024;
  lens.add(engravingRing);

  const focusRing = new THREE.Mesh(
    new THREE.TorusGeometry(outerRadius * 0.905, outerRadius * 0.027, 10, SEGMENTS_HIGH),
    rubberMaterial
  );
  focusRing.position.z = -0.016;
  lens.add(focusRing);

  // Reduced ridges to 16 for high performance
  const ridgeGeometry = new THREE.BoxGeometry(outerRadius * 0.024, outerRadius * 0.09, 0.04);
  for (let step = 0; step < 16; step += 1) {
    const angle = (step / 16) * Math.PI * 2;
    const radius = outerRadius * 0.91;
    const ridge = new THREE.Mesh(ridgeGeometry, rubberMaterial);
    ridge.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -0.038);
    ridge.rotation.z = angle;
    lens.add(ridge);
  }

  const innerWell = new THREE.Mesh(
    new THREE.CircleGeometry(glassRadius, SEGMENTS_HIGH),
    new THREE.MeshStandardMaterial({
      color: 0x010304,
      metalness: 0.28,
      roughness: 0.2,
      envMapIntensity: 1.15,
    })
  );
  innerWell.position.z = -0.135;
  lens.add(innerWell);

  const rearElement = new THREE.Mesh(
    new THREE.CircleGeometry(glassRadius * 0.805, SEGMENTS_HIGH),
    new THREE.MeshStandardMaterial({
      color: 0x09171b,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      envMapIntensity: 2.0,
    })
  );
  rearElement.position.z = -0.11;
  rearElement.renderOrder = 1;
  lens.add(rearElement);

  const irisRing = new THREE.Mesh(
    new THREE.RingGeometry(glassRadius * 0.255, glassRadius * 0.39, SEGMENTS_HIGH),
    new THREE.MeshStandardMaterial({
      color: 0x020303,
      metalness: 0.38,
      roughness: 0.3,
      envMapIntensity: 1.25,
    })
  );
  irisRing.position.z = -0.075;
  lens.add(irisRing);

  const aperture = new THREE.Mesh(
    new THREE.CircleGeometry(glassRadius * 0.25, 11),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  aperture.rotation.z = Math.PI / 11;
  aperture.position.z = -0.067;
  lens.add(aperture);

  const frontElement = new THREE.Mesh(
    new THREE.SphereGeometry(glassRadius * 0.988, SEGMENTS_MED, SEGMENTS_LOW, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0x0c1317,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      side: THREE.FrontSide,
      envMapIntensity: 2.2,
    })
  );
  frontElement.rotation.x = Math.PI / 2;
  frontElement.position.z = -0.02;
  frontElement.renderOrder = 3;
  lens.add(frontElement);

  const coating = new THREE.Mesh(
    new THREE.CircleGeometry(glassRadius * 0.985, SEGMENTS_HIGH),
    new THREE.MeshBasicMaterial({
      map: createLensCoatingTexture(),
      transparent: true,
      opacity: 0.38,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    })
  );
  coating.position.z = 0.014;
  coating.renderOrder = 4;
  lens.add(coating);

  lens.userData.coating = coating;
  return lens;
}

function removeLensCap(root) {
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  root.traverse((mesh) => {
    if (!mesh.isMesh || !mesh.geometry?.getAttribute("position")) return;

    const source = mesh.geometry;
    const position = source.getAttribute("position");
    const index = source.getIndex();
    const sourceCount = index ? index.count : position.count;
    const kept = [];
    let removed = 0;

    for (let offset = 0; offset < sourceCount; offset += 3) {
      const ia = index ? index.getX(offset) : offset;
      const ib = index ? index.getX(offset + 1) : offset + 1;
      const ic = index ? index.getX(offset + 2) : offset + 2;

      a.fromBufferAttribute(position, ia);
      b.fromBufferAttribute(position, ib);
      c.fromBufferAttribute(position, ic);

      const centerX = (a.x + b.x + c.x) / 3;
      const centerY = (a.y + b.y + c.y) / 3;
      const centerZ = (a.z + b.z + c.z) / 3;
      const radialDistance = Math.hypot(centerX - LENS_CAP.centerX, centerY - LENS_CAP.centerY);

      const belongsToCap =
        centerZ > LENS_CAP.zMin &&
        centerZ < LENS_CAP.zMax &&
        radialDistance < LENS_CAP.radius;

      if (belongsToCap) {
        removed += 1;
      } else {
        kept.push(ia, ib, ic);
      }
    }

    if (!removed) return;

    const capFreeGeometry = source.clone();
    capFreeGeometry.setIndex(kept);
    capFreeGeometry.computeBoundingBox();
    capFreeGeometry.computeBoundingSphere();
    mesh.geometry = capFreeGeometry;
    source.dispose();
    mesh.add(createPremiumLensAssembly());
  });
}

function addStudioPanel(studio, color, intensity, position, width, height) {
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color).multiplyScalar(intensity),
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  panel.position.copy(position);
  panel.lookAt(0, 0, 0);
  studio.add(panel);
}

function createPremiumStudioEnvironment() {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x020303);

  addStudioPanel(studio, 0xfff3df, 7.2, new THREE.Vector3(-5.8, 7.8, 7.7), 5.6, 4.9);
  addStudioPanel(studio, 0xf8fffd, 4.4, new THREE.Vector3(5.6, 1.8, 8.4), 4.4, 3.1);
  addStudioPanel(studio, 0xfcfff8, 3.2, new THREE.Vector3(0.4, 8.6, 5.8), 2.2, 6.2);
  addStudioPanel(studio, 0xfbfbf7, 2.35, new THREE.Vector3(-8.6, 0.8, 5.2), 1.2, 6.8);
  addStudioPanel(studio, 0xf5f8fa, 1.75, new THREE.Vector3(8.4, -0.3, 4.6), 0.95, 5.6);
  addStudioPanel(studio, 0x70d2b7, 1.08, new THREE.Vector3(-7.8, 2.3, -3.2), 2.9, 4.7);
  addStudioPanel(studio, 0xff1d25, 0.44, new THREE.Vector3(7.1, -1.8, -4.7), 2.1, 1.8);
  addStudioPanel(studio, 0x13191a, 0.48, new THREE.Vector3(0, -7.0, 0), 12.0, 10.0);

  return studio;
}

export default function Hero3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    let frameId;
    let disposed = false;
    let model;
    let environmentTexture;
    let studioEnvironment;
    let lensCoating;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false, // Turned off for maximum performance
        powerPreference: "high-performance",
      });
      // Cap pixel ratio at 1.0 to ensure extremely smooth frame rates on all devices
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      renderer.domElement.style.cssText =
        "display:block;width:100%;height:100%;pointer-events:none;";
      container.appendChild(renderer.domElement);
    } catch (error) {
      console.warn("Rumr premium camera hero could not initialise WebGL:", error);
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 11.25);
    camera.lookAt(1.3, 0.1, 0);

    const productRig = new THREE.Group();
    productRig.position.set(4, -0.067, 0);
    productRig.rotation.set(-0.075, -0.67, 0.06);
    scene.add(productRig);

    scene.add(new THREE.HemisphereLight(0xfbfffc, 0x0a1215, 4.5));
    scene.add(new THREE.AmbientLight(0x152220, 1.2));

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 8.0);
    keyLight.position.set(-6.4, 8.4, 9.2);
    scene.add(keyLight);

    const frontFill = new THREE.DirectionalLight(0xf5fbff, 4.0);
    frontFill.position.set(6.2, 2.0, 8.7);
    scene.add(frontFill);

    const greenEdge = new THREE.PointLight(0x48d1ad, 5.1, 22, 2);
    greenEdge.position.set(-7.2, 3.5, -4.0);
    scene.add(greenEdge);

    const redEdge = new THREE.PointLight(0xff1d25, 2.8, 18, 2);
    redEdge.position.set(6.2, -1.5, -5.2);
    scene.add(redEdge);

    const topSpecular = new THREE.PointLight(0xfff8ec, 11.2, 22, 2);
    topSpecular.position.set(-0.8, 8.8, 4.4);
    scene.add(topSpecular);

    const leftStrip = new THREE.PointLight(0xfaffff, 3.0, 20, 2);
    leftStrip.position.set(-7.8, 0.5, 5.6);
    scene.add(leftStrip);

    const rightStrip = new THREE.PointLight(0xf4f7fb, 2.15, 18, 2);
    rightStrip.position.set(7.6, -0.8, 4.6);
    scene.add(rightStrip);

    const leftRim = new THREE.PointLight(0xffffff, 80.0, 40, 1.2);
    leftRim.position.set(-8, 4, -6);
    scene.add(leftRim);

    const rightRim = new THREE.PointLight(0xfff5e6, 90.0, 40, 1.2);
    rightRim.position.set(8, 4, -6);
    scene.add(rightRim);

    const lowerBounce = new THREE.PointLight(0xe7ecef, 1.15, 18, 2);
    lowerBounce.position.set(0.5, -5.6, 5.0);
    scene.add(lowerBounce);

    // Debounced resize — no need to run on every pixel of drag
    let resizeTimeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }, 100);
    };
    // Initial size — no debounce
    const { width, height } = container.getBoundingClientRect();
    if (width && height) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    // Throttled pointer tracking
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

    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && isTabVisible && !frameId) {
          clock.start();
          animate();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isIntersecting && isTabVisible && !frameId) {
        clock.start();
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const loadCamera = async () => {
      try {
        const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
        const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
        if (disposed) return;

        studioEnvironment = createPremiumStudioEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        environmentTexture = pmremGenerator.fromScene(studioEnvironment, 0.04).texture;
        scene.environment = environmentTexture;
        pmremGenerator.dispose(); // Free PMREM resources after generation
        
        const loader = new GLTFLoader();
        
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
          "/red_digital_cinema_weapon_dragon_8k_camera_optimized.glb",
          (gltf) => {
            if (disposed) {
              disposeObject(gltf.scene);
              return;
            }

            model = gltf.scene;
            upgradeCameraMaterials(model);
            removeLensCap(model);
            
            // Remove the turntable base from the RED camera model
            const toRemove = [];
            model.traverse((child) => {
              if (child.name === "Turntable") {
                toRemove.push(child);
              }
            });
            toRemove.forEach(child => {
              if (child.parent) child.parent.remove(child);
            });
            
            model.updateMatrixWorld(true);

            const bounds = new THREE.Box3().setFromObject(model);
            const center = bounds.getCenter(new THREE.Vector3());
            const size = bounds.getSize(new THREE.Vector3());
            const largestDimension = Math.max(size.x, size.y, size.z) || 1;

            model.position.sub(center);
            model.scale.setScalar(5.7 / largestDimension);
            model.rotation.y = Math.PI * 0.65;

            // Freeze matrices after positioning — saves per-frame computation
            model.traverse((object) => {
              if (!object.isMesh) return;
              object.castShadow = false;
              object.receiveShadow = false;
              object.frustumCulled = true;
              const materials = Array.isArray(object.material)
                ? object.material
                : [object.material];
              
              materials.forEach((material) => {
                if (!material) return;
                
                if ("envMapIntensity" in material) {
                  material.envMapIntensity = Math.max(material.envMapIntensity || 0, 2.15);
                }
                
                material.needsUpdate = true;
              });
              
              if (object.name === "Rumr premium optical lens") {
                lensCoating = object.userData?.coating || null;
              }
            });

            productRig.add(model);
          },
          undefined,
          (error) => {
            console.error('An error happened loading the GLB model:', error);
          }
        );
      } catch (error) {
        console.warn("Rumr camera hero could not load:", error);
      }
    };
    loadCamera();

    const clock = new THREE.Clock();
    const animate = () => {
      if (!isIntersecting || !isTabVisible) {
        frameId = null;
        return;
      }
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      productRig.rotation.y +=
        (-0.67 + pointer.x * 0.11 + Math.sin(elapsed * 0.22) * 0.022 - productRig.rotation.y) * 0.045;
      productRig.rotation.x +=
        (-0.075 - pointer.y * 0.042 - productRig.rotation.x) * 0.04;
      productRig.position.y = -0.067 + Math.sin(elapsed * 0.78) * 0.075;

      if (lensCoating?.material) {
        lensCoating.rotation.z += (pointer.x * 0.012 - lensCoating.rotation.z) * 0.06;
        lensCoating.position.x += (pointer.x * 0.015 - lensCoating.position.x) * 0.05;
        lensCoating.position.y += (-pointer.y * 0.012 - lensCoating.position.y) * 0.05;
        lensCoating.material.opacity += (0.36 - lensCoating.material.opacity) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      if (model) disposeObject(model);
      environmentTexture?.dispose?.();
      disposeScene(studioEnvironment);
      renderer.renderLists?.dispose?.();
      renderer.dispose();
      renderer.domElement.remove();
    };

  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 hidden md:block pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
