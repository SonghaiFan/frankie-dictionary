export const cardVariants = {
  hidden: {
    y: -1000,
    x: 0,
  },
  visible: {
    y: 0,
    x: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
  },
  exit: {
    y: 1000,
    x: -1000,
    opacity: 0,
    rotateX: 90,
    rotateY: 0,
    rotateZ: 90,
  },
};

// Transition settings
export const cardTransition = {
  type: "spring",
  stiffness: 800,
  damping: 180,
  mass: 10,
  duration: 0.3,
};

export const heartVariants = {
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
  click: {
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 300,
      duration: 0.1,
    },
  },
};
