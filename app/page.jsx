"use client";
import { useState, useEffect } from "react";
import { data } from "@/public/data/data";
import BlueCard from "@/components/BlueCard";
import Footer from "@/components/Footer";
import useFuseSearch from "@/hooks/useFuseSearch";
import SearchInput from "@/components/SearchInput";
import Title from "@/components/Title";
import Vinyl from "@/components/Vinyl";
import ParticleRain from "@/components/ParticleRain";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isVinylPlaying, setIsVinylPlaying] = useState(false);
  const [isRandomWord, setIsRandomWord] = useState(false);

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * data.length));
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC key closes modal if open
      if (e.key === "Escape" && showExplanation) {
        e.preventDefault();
        handleCloseModal();
      }

      // Ctrl/Cmd + K focuses search input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + R for random word (when modal is not open)
      if ((e.ctrlKey || e.metaKey) && e.key === "r" && !showExplanation) {
        e.preventDefault();
        handleRandom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showExplanation]);

  const placeholder = data[randomIndex];
  const results = useFuseSearch(data, query);

  const handleSelect = (item) => {
    setShowExplanation(true);
    setSelectedItem(item);
    setQuery(item.中文);
    setIsRandomWord(false);
  };

  const handleOpenModal = () => {
    if (results.length === 0 && query) {
      return;
    }

    if (results.length === 0 && !query) {
      setShowExplanation(true);
      setSelectedItem(placeholder);
      setIsRandomWord(true);
      return;
    }

    if (results.length > 0 && results[0].中文 === query) {
      setShowExplanation(true);
      setSelectedItem(results[0]);
      setIsRandomWord(false);
    }
  };

  const handleCloseModal = () => {
    setShowExplanation(false);
    setSelectedItem(null);

    if (isRandomWord) {
      setRandomIndex(Math.floor(Math.random() * data.length));
      setIsRandomWord(false);
    }
  };

  const handleRandom = () => {
    setSelectedItem(null);
    setQuery("");
    setRandomIndex(Math.floor(Math.random() * data.length));
    setIsRandomWord(false);
  };

  const handleVinylPlayingChange = (playing) => {
    setIsVinylPlaying(playing);
  };

  const filteredData = selectedItem || (query ? results[0] : []);

  return (
    <div className="flex flex-col items-center w-full mx-auto min-h-screen overflow-auto relative">
      {/* Main Content */}
      <div className="flex-grow" />
      <div className="h-[10%] relative z-10">
        <Vinyl onPlayingChange={handleVinylPlayingChange} />
        <Title />
      </div>
      <div className="h-[40%] mb-[10%] relative z-10">
        <SearchInput
          query={query}
          setQuery={setQuery}
          defaultText={placeholder?.中文}
          onSelect={handleSelect}
          results={results}
          onRandom={handleRandom}
          onConfirm={handleOpenModal}
        />
      </div>
      <BlueCard
        show={showExplanation}
        onClose={handleCloseModal}
        data={filteredData}
        onRandom={handleRandom}
      />
      <div className="flex-grow" />
      <Footer />

      {/* Particle Rain Background */}
      <ParticleRain isActive={isVinylPlaying} />

      {/* Keyboard shortcuts hint */}
      {!showExplanation && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-400 bg-white bg-opacity-80 px-3 py-2 rounded-lg shadow-md opacity-60 hover:opacity-100 transition-opacity">
          <div>⌘K / Ctrl+K: Focus search</div>
          <div>⌘R / Ctrl+R: Random word</div>
          <div>ESC: Close modal</div>
        </div>
      )}
    </div>
  );
}
