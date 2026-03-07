import { useRef, useEffect } from "react";

const PHASE_CONFIGS = [
  { count: 30, speed: 0.6, hue: 215, sat: 60, light: 45, size: 2.5, opacity: 0.35 }, // no phase
  { count: 35, speed: 0.7, hue: 212, sat: 62, light: 47, size: 2.5, opacity: 0.4 },
  { count: 45, speed: 0.85, hue: 208, sat: 65, light: 50, size: 2.8, opacity: 0.45 },
  { count: 60, speed: 1.0, hue: 203, sat: 68, light: 53, size: 3.0, opacity: 0.5 },
  { count: 80, speed: 1.2, hue: 197, sat: 72, light: 56, size: 3.0, opacity: 0.55 },
  { count: 105, speed: 1.45, hue: 190, sat: 75, light: 58, size: 3.2, opacity: 0.6 },
  { count: 135, speed: 1.75, hue: 182, sat: 78, light: 60, size: 3.2, opacity: 0.65 },
];

function createParticle(canvasWidth, canvasHeight, laneCount) {
  const lane = Math.floor(Math.random() * laneCount);
  const laneHeight = canvasHeight / (laneCount + 1);
  return {
    x: Math.random() * -canvasWidth * 0.3,
    baseY: laneHeight * (lane + 1),
    speed: 0.3 + Math.random() * 0.7,
    size: 0.7 + Math.random() * 0.6,
    waveAmp1: 8 + Math.random() * 16,
    waveFreq1: 0.002 + Math.random() * 0.003,
    waveAmp2: 4 + Math.random() * 8,
    waveFreq2: 0.004 + Math.random() * 0.004,
    waveOffset: Math.random() * Math.PI * 2,
    opacity: 0.6 + Math.random() * 0.4,
  };
}

export default function ParticleHeader({ activePhase }) {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    config: { ...PHASE_CONFIGS[0] },
    targetConfig: { ...PHASE_CONFIGS[0] },
    width: 0,
    height: 0,
  });

  // Update target config when phase changes
  useEffect(() => {
    const idx = activePhase == null ? 0 : activePhase + 1;
    const clamped = Math.min(idx, PHASE_CONFIGS.length - 1);
    stateRef.current.targetConfig = { ...PHASE_CONFIGS[clamped] };
  }, [activePhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const header = headerRef.current;
    if (!canvas || !header) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const rect = header.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(header);

    const LANE_COUNT = 6;
    const LERP_RATE = 0.04;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      const s = stateRef.current;
      const { width, height, config, targetConfig } = s;
      if (!width || !height) { animRef.current = requestAnimationFrame(animate); return; }

      ctx.clearRect(0, 0, width, height);

      // Lerp config toward target
      config.count = lerp(config.count, targetConfig.count, LERP_RATE);
      config.speed = lerp(config.speed, targetConfig.speed, LERP_RATE);
      config.hue = lerp(config.hue, targetConfig.hue, LERP_RATE);
      config.sat = lerp(config.sat, targetConfig.sat, LERP_RATE);
      config.light = lerp(config.light, targetConfig.light, LERP_RATE);
      config.size = lerp(config.size, targetConfig.size, LERP_RATE);
      config.opacity = lerp(config.opacity, targetConfig.opacity, LERP_RATE);

      const isMobile = width < 768;
      const targetCount = Math.round(config.count * (isMobile ? 0.6 : 1));

      // Spawn particles if needed
      while (s.particles.length < targetCount) {
        s.particles.push(createParticle(width, height, LANE_COUNT));
      }
      // Remove excess
      if (s.particles.length > targetCount + 10) {
        s.particles.length = targetCount;
      }

      // Update and draw
      for (let i = 0; i < s.particles.length; i++) {
        const p = s.particles[i];
        p.x += p.speed * config.speed;

        const age = Math.max(0, p.x / width);

        // Recycle
        if (age > 1) {
          s.particles[i] = createParticle(width, height, LANE_COUNT);
          s.particles[i].x = Math.random() * -50;
          continue;
        }

        const y = p.baseY
          + Math.sin(p.x * p.waveFreq1 + p.waveOffset) * p.waveAmp1
          + Math.sin(p.x * p.waveFreq2 + p.waveOffset * 1.7) * p.waveAmp2;

        const radius = p.size * config.size * (1 - age * 0.7);
        const alpha = p.opacity * config.opacity * (1 - age * 0.85);

        if (alpha < 0.01 || radius < 0.2) continue;

        ctx.beginPath();
        ctx.arc(p.x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${Math.round(config.hue)}, ${Math.round(config.sat)}%, ${Math.round(config.light)}%, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="header-inner">
        <div className="header-eyebrow">Zeal IT Consultants</div>
        <div className="header-divider" />
        <h1 className="header-title">Agentic Readiness Framework</h1>
        <p className="header-subtitle">
          The IT maturity required at each phase &mdash; and how Zeal moves you to the next one.
        </p>
      </div>
    </header>
  );
}
