import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const VinylCover = ({ children }) => {
  return (
    <div className="flex justify-center bg-kleinBlue rounded mb-2 w-fit h-fit m-auto shadow-xl">
      <div
        className={`relative md:w-[250px] md:h-[250px] w-[100px] h-[100px] rounded-full overflow-hidden `}
      >
        {children}
      </div>
    </div>
  );
};

const Vinyl = () => {
  const [randomIndex, setRandomIndex] = useState(null);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);

  // This useEffect will run once, when the component is mounted on the client side
  useEffect(() => {
    // Generate a random index for the image
    setRandomIndex(Math.floor(Math.random() * 6) + 1);
  }, []);

  useEffect(() => {
    // Initialize the audio element and set it to loop
    if (randomIndex !== null) {
      audioRef.current = new Audio(`/music/Sad_Lofi${randomIndex}.mp3`);
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
  }, [playing]);

  const toggleMusic = () => {
    setPlaying(!playing);
  };

  // Render a placeholder or null until the randomIndex is set
  if (randomIndex === null) {
    return (
      <VinylCover>
        <div className="absolute inset-0 w-full h-full bg-black"></div>
      </VinylCover>
    );
  }

  return (
    <VinylCover>
      <Image
        className={`absolute inset-0 w-full h-full object-cover rounded-full ${
          playing ? "rotate" : "grayscale"
        } hover:grayscale-0 hover:scale-105 transition-all duration-500 ease-in-out`}
        src={`/images/Blue_Photo${randomIndex}.jpg`}
        onClick={toggleMusic}
        alt="Blue_Photo"
        width={300}
        height={300}
        priority
      />
    </VinylCover>
  );
};

export default Vinyl;
