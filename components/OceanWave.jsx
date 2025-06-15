import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useMemo, useCallback, useEffect } from "react";
import { usePlayback } from "@/contexts/PlaybackContext";

const CONFIG = {
  width: 600,
  height: 200,
  waves: [
    {
      amplitude: 25,
      frequency: 0.015,
      baseY: 120,
      speed: 0.003,
      opacity: 0.9,
      color: "#130f94", // kleinBlue
    },
    {
      amplitude: 20,
      frequency: 0.02,
      baseY: 110,
      speed: 0.004,
      opacity: 0.7,
      color: "#130f94", // kleinBlue
    },
    {
      amplitude: 15,
      frequency: 0.025,
      baseY: 100,
      speed: 0.005,
      opacity: 0.5,
      color: "#130f94", // kleinBlue
    },
  ],
  pointStep: 1.5,
};

export default function OceanWave() {
  const waveRefs = useRef(CONFIG.waves.map(() => null));
  const { isPlaying } = usePlayback();
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef(null);

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

  // Optimize wave path calculation
  const calculateWavePath = useCallback((phase, waveConfig) => {
    const points = [];
    for (let x = 0; x <= CONFIG.width; x += CONFIG.pointStep) {
      const y =
        waveConfig.baseY +
        Math.sin(x * waveConfig.frequency + phase) * waveConfig.amplitude;
      points.push(`${x},${y}`);
    }
    return `M${points.join(" L")} L${CONFIG.width},${CONFIG.height} L0,${
      CONFIG.height
    } Z`;
  }, []);

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
          const speedMultiplier = isPlaying ? 1.5 : 1;
          const phase = timestamp * wave.speed * speedMultiplier;
          const d = calculateWavePath(phase, wave);

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
          <motion.path
            key={index}
            ref={(el) => (waveRefs.current[index] = el)}
            fill={`url(#waveGradient-${index})`}
            filter="url(#waveShadow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: index * 0.2,
              ease: "easeOut",
            }}
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
