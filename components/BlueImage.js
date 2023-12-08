import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const BlueImage = () => {
  const [randomIndex, setRandomIndex] = useState(1);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the audio element and set it to loop
    audioRef.current = new Audio(`/music/Music${randomIndex}.mp3`);
    audioRef.current.loop = true;

    return () => {
      // Cleanup: stop the music when the component unmounts
      audioRef.current.pause();
    };
  }, [randomIndex]);

  useEffect(() => {
    // Handle playing state change
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  const toggleMusic = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * 6) + 1);
  }, []);

  // Define the width and height of your images
  const imageWidth = 300;
  const imageHeight = 300;

  return (
    <div className="flex justify-center bg-kleinBlue rounded mb-2 w-fit m-auto">
      <div
        className="relative md:w-[300px] md:h-[300px] w-[100px] h-[100px] rounded-full shadow-lg overflow-hidden "
        onClick={toggleMusic}
      >
        <Image
          src={`/images/Blue_Photo${randomIndex}.jpg`}
          alt="Blue_Photo"
          width={imageWidth}
          height={imageHeight}
          className={`absolute inset-0 w-full h-full object-cover rounded-full ${
            playing ? "rotate" : "grayscale"
          } hover:grayscale-0 transition-all duration-500 ease-in-out`}
          priority
        />
      </div>
    </div>
  );
};

export default BlueImage;
