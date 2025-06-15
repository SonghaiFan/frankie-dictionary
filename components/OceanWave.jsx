import { useAnimationFrame } from "framer-motion";
import { useRef, useMemo, useCallback, useEffect } from "react";
import { usePlayback } from "@/contexts/PlaybackContext";

const CONFIG = {
  width: 600,
  height: 200,
  waves: [
    {
      amplitude: 25,
      frequency: 0.004,
      baseY: 140,
      speed: 0.6,
      opacity: 1,
      color: "#0a0870", // 更深的蓝色
      noise: 0.5,
      phaseOffset: 0,
    },
    {
      amplitude: 30,
      frequency: 0.003,
      baseY: 135,
      speed: 0.4,
      opacity: 0.85,
      color: "#0d0a8a",
      noise: 0.45,
      phaseOffset: Math.PI / 4,
    },
    {
      amplitude: 35,
      frequency: 0.002,
      baseY: 130,
      speed: 0.3,
      opacity: 0.7,
      color: "#130f94",
      noise: 0.4,
      phaseOffset: Math.PI / 2,
    },
    {
      amplitude: 40,
      frequency: 0.001,
      baseY: 125,
      speed: 0.2,
      opacity: 0.55,
      color: "#1a16b3",
      noise: 0.35,
      phaseOffset: Math.PI * 0.75,
    },
  ],
  pointStep: 2, // Increased for fewer points
};

export default function OceanWave() {
  const waveRefs = useRef(CONFIG.waves.map(() => null));
  const { isPlaying } = usePlayback();
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const noiseOffsetsRef = useRef(CONFIG.waves.map(() => Math.random() * 1000));
  const pointsCacheRef = useRef(new Map());

  // Memoize gradient definitions
  const gradientDefinitions = useMemo(() => {
    return CONFIG.waves.map((wave, index) => (
      <linearGradient
        key={`gradient-${index}`}
        id={`waveGradient-${index}`}
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#130f94" stopOpacity="0" />
        <stop
          offset="20%"
          stopColor="#130f94"
          stopOpacity={wave.opacity * 0.2}
        />
        <stop
          offset="40%"
          stopColor="#130f94"
          stopOpacity={wave.opacity * 0.4}
        />
        <stop
          offset="60%"
          stopColor="#130f94"
          stopOpacity={wave.opacity * 0.6}
        />
        <stop
          offset="80%"
          stopColor="#130f94"
          stopOpacity={wave.opacity * 0.8}
        />
        <stop offset="100%" stopColor="#130f94" stopOpacity="1" />
      </linearGradient>
    ));
  }, []);

  // Simplified noise function
  const noise = useCallback((x, y) => {
    return Math.sin(x * 0.1 + y * 0.1) * 0.5;
  }, []);

  // Optimized wave path calculation
  const calculateWavePath = useCallback(
    (phase, waveConfig, noiseOffset) => {
      const cacheKey = `${phase.toFixed(2)}-${noiseOffset.toFixed(2)}`;
      if (pointsCacheRef.current.has(cacheKey)) {
        return pointsCacheRef.current.get(cacheKey);
      }

      const points = [];
      for (let x = 0; x <= CONFIG.width; x += CONFIG.pointStep) {
        // Simplified wave calculation
        const baseWave = Math.sin(
          x * waveConfig.frequency + phase + waveConfig.phaseOffset
        );
        const noiseValue =
          noise(x * 0.01 + noiseOffset, phase * 0.01) * waveConfig.noise;
        const y =
          waveConfig.baseY + (baseWave + noiseValue) * waveConfig.amplitude;
        points.push(`${x},${y}`);
      }

      const path = `M${points.join(" L")} L${CONFIG.width},${
        CONFIG.height
      } L0,${CONFIG.height} Z`;

      // Cache the result
      pointsCacheRef.current.set(cacheKey, path);

      // Limit cache size
      if (pointsCacheRef.current.size > 100) {
        const firstKey = pointsCacheRef.current.keys().next().value;
        pointsCacheRef.current.delete(firstKey);
      }

      return path;
    },
    [noise]
  );

  // Optimized animation frame updates
  const updateWaves = useCallback(
    (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(updateWaves);
        return;
      }

      const deltaTime = timestamp - lastTimeRef.current;

      // Skip frame if not enough time has passed (target 30fps instead of 60fps)
      if (deltaTime < 32) {
        animationFrameRef.current = requestAnimationFrame(updateWaves);
        return;
      }

      lastTimeRef.current = timestamp;

      CONFIG.waves.forEach((wave, index) => {
        const speedMultiplier = isPlaying ? 1.2 : 0.5;
        const baseSpeed = 0.001;
        const phase = timestamp * baseSpeed * wave.speed * speedMultiplier;
        noiseOffsetsRef.current[index] += 0.01;

        const d = calculateWavePath(
          phase,
          wave,
          noiseOffsetsRef.current[index]
        );

        if (waveRefs.current[index]) {
          waveRefs.current[index].setAttribute("d", d);
        }
      });

      animationFrameRef.current = requestAnimationFrame(updateWaves);
    },
    [isPlaying, calculateWavePath]
  );

  // Start animation
  useAnimationFrame(updateWaves);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      pointsCacheRef.current.clear();
    };
  }, []);

  return (
    <div className="w-full h-[120px] overflow-hidden relative -mb-1">
      {/* SVG Waves */}
      <svg
        viewBox={`0 0 ${CONFIG.width} ${CONFIG.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {gradientDefinitions}

          {/* Drop shadow filter */}
          <filter id="waveShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="2"
              floodColor="#0a0870"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Render multiple wave layers */}
        {CONFIG.waves.map((wave, index) => (
          <path
            key={index}
            ref={(el) => (waveRefs.current[index] = el)}
            fill={`url(#waveGradient-${index})`}
            filter="url(#waveShadow)"
          />
        ))}
      </svg>

      {/* Subtle foam/bubble effect overlay */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center top, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 40%, 
            transparent 70%)`,
        }}
      />
    </div>
  );
}
