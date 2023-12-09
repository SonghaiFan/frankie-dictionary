export const cardVariants = {
  hidden: {
    scale: 0.5,
    y: 1000,
    opacity: 0,
    rotateZ: 90,
  },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    rotateZ: 0,
  },
  exit: {
    scale: 0.5,
    y: 1000,
    opacity: 0,
    rotateZ: 90,
  },
};

// Transition settings
export const cardTransition = {
  type: "spring",
  stiffness: 300,
  damping: 40,
  mass: 2,
  duration: 0.2,
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
