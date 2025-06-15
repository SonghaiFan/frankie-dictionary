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
  pointStep: 1.2, // Reduced for smoother curves
};

export default function OceanWave() {
  const waveRefs = useRef(CONFIG.waves.map(() => null));
  const { isPlaying } = usePlayback();
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const noiseOffsetsRef = useRef(CONFIG.waves.map(() => Math.random() * 1000));

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

  // Simplex noise function for natural wave movement
  const noise = useCallback((x, y) => {
    return Math.sin(x * 0.1 + y * 0.1) * Math.cos(x * 0.05 - y * 0.05);
  }, []);

  // Optimize wave path calculation with noise
  const calculateWavePath = useCallback(
    (phase, waveConfig, noiseOffset) => {
      const points = [];
      for (let x = 0; x <= CONFIG.width; x += CONFIG.pointStep) {
        // Add multiple sine waves with different frequencies for more natural movement
        const baseWave = Math.sin(
          x * waveConfig.frequency + phase + waveConfig.phaseOffset
        );
        const secondaryWave =
          Math.sin(x * waveConfig.frequency * 1.5 + phase * 0.8) * 0.3;
        const tertiaryWave =
          Math.sin(x * waveConfig.frequency * 0.5 + phase * 1.2) * 0.2;

        // Add noise for more organic movement
        const noiseValue =
          noise(x * 0.01 + noiseOffset, phase * 0.01) * waveConfig.noise;

        const y =
          waveConfig.baseY +
          (baseWave + secondaryWave + tertiaryWave + noiseValue) *
            waveConfig.amplitude;

        points.push(`${x},${y}`);
      }
      return `M${points.join(" L")} L${CONFIG.width},${CONFIG.height} L0,${
        CONFIG.height
      } Z`;
    },
    [noise]
  );

  // Optimize animation frame updates
  const updateWaves = useCallback(
    (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Only update if enough time has passed (target 60fps)
      if (deltaTime > 16) {
        CONFIG.waves.forEach((wave, index) => {
          const speedMultiplier = isPlaying ? 1.2 : 0.5;
          const baseSpeed = 0.001; // Base speed factor
          const phase = timestamp * baseSpeed * wave.speed * speedMultiplier;

          // Update noise offset for continuous movement
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
      }

      animationFrameRef.current = requestAnimationFrame(updateWaves);
    },
    [isPlaying, calculateWavePath]
  );

  // Start animation
  useAnimationFrame(updateWaves);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
