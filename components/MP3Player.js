import { useState, useEffect, useRef } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";

const MP3Player = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the audio element and set it to loop
    audioRef.current = new Audio("/music/Shipwreck-Cove(chosic.com).mp3");
    audioRef.current.loop = true;

    return () => {
      // Cleanup: stop the music when the component unmounts
      audioRef.current.pause();
    };
  }, []);

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

  return (
    <div className="fixed top-5 right-3">
      <button
        className="text-xl p-2 rounded-lg bg-kleinBlue"
        onClick={toggleMusic}
        aria-label={playing ? "Stop music" : "Play music"}
      >
        {playing ? (
          <MdMusicNote className="text-white" />
        ) : (
          <MdMusicOff className="text-white" />
        )}
      </button>
    </div>
  );
};

export default MP3Player;
