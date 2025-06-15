import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";

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
      color: "#1e1b9e", // slightly lighter kleinBlue
    },
    {
      amplitude: 15,
      frequency: 0.025,
      baseY: 100,
      speed: 0.005,
      opacity: 0.5,
      color: "#2d2aaa", // even lighter kleinBlue
    },
  ],
  pointStep: 1.5,
};

function getWavePath(phase, waveConfig) {
  const { width, height, amplitude, frequency, baseY, pointStep } = CONFIG;
  const points = [];

  for (let x = 0; x <= width; x += pointStep) {
    const y =
      waveConfig.baseY +
      Math.sin(x * waveConfig.frequency + phase) * waveConfig.amplitude;
    points.push(`${x},${y}`);
  }

  return `M${points.join(" L")} L${width},${height} L0,${height} Z`;
}

export default function OceanWave() {
  const waveRefs = useRef(CONFIG.waves.map(() => null));

  useAnimationFrame((t) => {
    CONFIG.waves.forEach((wave, index) => {
      const phase = t * wave.speed;
      const d = getWavePath(phase, wave);
      if (waveRefs.current[index]) {
        waveRefs.current[index].setAttribute("d", d);
      }
    });
  });

  return (
    <div className="w-full h-[120px] overflow-hidden relative">
      {/* Background that ensures seamless footer connection */}
      <div className="absolute bottom-0 w-full h-8 bg-kleinBlue" />

      {/* SVG Waves */}
      <svg
        viewBox={`0 0 ${CONFIG.width} ${CONFIG.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Gradient definitions for each wave */}
          {CONFIG.waves.map((wave, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`waveGradient-${index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={wave.color} stopOpacity="0" />
              <stop
                offset="30%"
                stopColor={wave.color}
                stopOpacity={wave.opacity * 0.3}
              />
              <stop
                offset="60%"
                stopColor={wave.color}
                stopOpacity={wave.opacity * 0.7}
              />
              <stop offset="85%" stopColor="#130f94" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#130f94" stopOpacity="1" />
            </linearGradient>
          ))}

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
