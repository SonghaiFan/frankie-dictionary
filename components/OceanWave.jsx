import { motion } from "framer-motion";

const WAVE_CONFIG = {
  width: 500,
  height: 400,
  amplitude: 60,
  frequency: 0.01,
  baseY: 100,
  pointStep: 2,
};

function calculateDuration(frequency) {
  // For a sine wave, one complete cycle is 2π
  // We want the animation to complete one full cycle
  // Duration in seconds = (2π / frequency) * (1/60) to convert to seconds
  return ((2 * Math.PI) / frequency) * (1 / 60);
}

function generateWavePath(phase = 0) {
  const { width, height, amplitude, frequency, baseY, pointStep } = WAVE_CONFIG;
  const points = [];

  // Generate points for the wave
  for (let x = 0; x <= width; x += pointStep) {
    const y = baseY + Math.sin(x * frequency + phase) * amplitude;
    points.push(`${x},${y}`);
  }

  // Create the SVG path
  return `M${points.join(" L")} L${width},${height} L0,${height} Z`;
}

const OceanWave = () => {
  const duration = calculateDuration(WAVE_CONFIG.frequency);

  // Animate control points of the wave
  const waveVariants = {
    animate: {
      d: [
        generateWavePath(0),
        generateWavePath(Math.PI / 2),
        generateWavePath(Math.PI),
        generateWavePath(Math.PI * 1.5),
        generateWavePath(Math.PI * 2),
      ],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration,
        ease: "linear",
      },
    },
  };

  return (
    <div className="h-[4rem] w-full overflow-hidden">
      <svg
        className="w-full h-32"
        viewBox={`0 0 ${WAVE_CONFIG.width} ${WAVE_CONFIG.height}`}
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ d: generateWavePath(0) }}
          animate="animate"
          variants={waveVariants}
          fill="#130f94"
        />
      </svg>
    </div>
  );
};

export default OceanWave;
