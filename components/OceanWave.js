import React from "react";
import { motion } from "framer-motion";

const OceanWave = () => {
  // Animate control points of the wave
  const waveVariants = {
    animate: {
      d: [
        "M0,50 C150,0 350,100 500,50 L500,150 L0,150 Z", // wave variation 1
        "M0,50 C150,100 350,0 500,50 L500,150 L0,150 Z", // wave variation 2
      ],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="h-[4rem] w-full overflow-hidden">
      <svg
        className="w-full h-32"
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ d: "M0,50 C150,75 350,25 500,50 L500,150 L0,150 Z" }} // initial wave shape
          animate="animate"
          variants={waveVariants}
          fill="#130f94"
        />
      </svg>
    </div>
  );
};

export default OceanWave;
