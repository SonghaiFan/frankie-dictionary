import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const VinylCover = ({ children }) => {
  return (
    <div className="flex justify-center bg-kleinBlue rounded mb-2 w-fit h-fit m-auto shadow-xl">
      <div
        className={`relative md:w-[250px] md:h-[250px] w-[150px] h-[150px] rounded-full overflow-hidden `}
      >
        {children}
      </div>
    </div>
  );
};

const Vinyl = ({ onPlayingChange }) => {
  const [randomIndex, setRandomIndex] = useState(null);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);

  // This useEffect will run once, when the component is mounted on the client side
  useEffect(() => {
    // Generate a random index for the image
    setRandomIndex(Math.floor(Math.random() * 9) + 1);
  }, []);

  useEffect(() => {
    // Initialize the audio element and set it to loop
    if (randomIndex !== null) {
      audioRef.current = new Audio(`/music/Sad_LoFi${randomIndex}.mp3`);
      audioRef.current.loop = true;

      return () => {
        // Cleanup: stop the music when the component unmounts
        audioRef.current.pause();
      };
    }
  }, [randomIndex]);

  useEffect(() => {
    // Handle playing state change
    if (playing && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    // Notify parent component of playing state change
    if (onPlayingChange) {
      onPlayingChange(playing);
    }
  }, [playing, onPlayingChange]);

  const toggleMusic = () => {
    setPlaying(!playing);
  };

  const imageVariants = {
    playing: {
      rotate: 360,
      filter: "grayscale(0%)",
      transition: {
        rotate: {
          duration: 15,
          ease: "linear",
          repeat: Infinity, // Loop only for rotation
        },
        filter: {
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    },
    paused: {
      rotate: 0,
      filter: "grayscale(100%)",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // Hover variants
  const hoverVariants = {
    hover: {
      scale: 1.05, // scale up slightly on hover
      filter: "grayscale(0%)", // remove grayscale on hover
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // Render a placeholder or null until the randomIndex is set
  if (randomIndex === null) {
    return <VinylCover></VinylCover>;
  }
  return (
    <VinylCover>
      <motion.img
        initial="paused"
        animate={playing ? "playing" : "paused"}
        whileHover="hover"
        variants={{ ...imageVariants, ...hoverVariants }}
        src={`/images/Blue_Photo${randomIndex}.jpg`}
        onClick={toggleMusic}
        alt="Blue_Photo"
        width={10}
        height={10}
        className="absolute inset-0 w-full h-full object-cover rounded-full cursor-pointer shadow-xl"
        style={{ position: "absolute", inset: 0 }}
      />
    </VinylCover>
  );
};

export default Vinyl;
