"use client";

import { createContext, useContext, useState } from "react";

const PlaybackContext = createContext();

export function PlaybackProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <PlaybackContext.Provider value={{ isPlaying, togglePlayback }}>
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
}
