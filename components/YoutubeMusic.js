import { useState } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import YouTube from "react-youtube";

const YouTubeMusicPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(false);

  const videoOptions = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0, // Set autoplay to 0
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
    <div className="fixed top-5 right-3">
      <YouTube
        videoId="jfKfPfyJRdk"
        opts={videoOptions}
        onReady={onReady}
        className="hidden"
      />
      <button
        className={`text-2xl p-2 rounded-lg bg-kleinBlue`}
        onClick={toggleMusic}
        aria-label={playing ? "Stop" : "Play"}
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

export default YouTubeMusicPlayer;
