import { useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import YouTube from "react-youtube";

const YouTubeMusicPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(true);

  const videoOptions = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      loop: 1,
      fs: 0,
      cc_load_policy: 0,
      iv_load_policy: 3,
      autohide: 1,
      playlist: "jfKfPfyJRdk",
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const toggleMusic = () => {
    if (player) {
      if (playing) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setPlaying(!playing);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <YouTube
        videoId="jfKfPfyJRdk"
        opts={videoOptions}
        onReady={onReady}
        className="hidden"
      />
      <button
        className={`p-2 rounded-lg bg-kleinBlue`}
        onClick={toggleMusic}
        aria-label={playing ? "Stop" : "Play"}
      >
        {playing ? (
          <FaStop className="text-white" />
        ) : (
          <FaPlay className="text-white" />
        )}
      </button>
    </div>
  );
};

export default YouTubeMusicPlayer;
