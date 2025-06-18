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
import { PlaybackProvider } from "@/contexts/PlaybackContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRandomWord, setIsRandomWord] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * data.length));
  }, []);

  const placeholder = data[randomIndex];
  const results = useFuseSearch(data, query);

  // Handle URL parameters for shared words
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedWord = urlParams.get("word");

    if (sharedWord) {
      // Find the word in the data
      const foundWord = data.find(
        (item) => item.中文 === decodeURIComponent(sharedWord)
      );

      if (foundWord) {
        // Set the word and show the modal
        setSelectedItem(foundWord);
        setQuery(foundWord.中文);
        setShowExplanation(true);
        setIsRandomWord(false);

        // Update current word index for navigation
        const index = data.findIndex((word) => word.中文 === foundWord.中文);
        setCurrentWordIndex(index !== -1 ? index : 0);

        // Clean up the URL without refreshing the page
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
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

      // Arrow keys for navigation when modal is not open
      if (!showExplanation) {
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          handlePreviousWord();
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          handleNextWord();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showExplanation, currentWordIndex]);

  const handleSelect = (item) => {
    setShowExplanation(true);
    setSelectedItem(item);
    setQuery(item.中文);
    setIsRandomWord(false);
    // Update current word index for navigation
    const index = data.findIndex((word) => word.中文 === item.中文);
    setCurrentWordIndex(index !== -1 ? index : 0);
  };

  const handleOpenModal = () => {
    if (results.length === 0 && query) {
      return;
    }

    if (results.length === 0 && !query) {
      setShowExplanation(true);
      setSelectedItem(placeholder);
      setIsRandomWord(true);
      const index = data.findIndex((word) => word.中文 === placeholder.中文);
      setCurrentWordIndex(index !== -1 ? index : randomIndex);
      return;
    }

    if (results.length > 0 && results[0].中文 === query) {
      setShowExplanation(true);
      setSelectedItem(results[0]);
      setIsRandomWord(false);
      const index = data.findIndex((word) => word.中文 === results[0].中文);
      setCurrentWordIndex(index !== -1 ? index : 0);
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

  const handleClearSearch = () => {
    setQuery("");
    setSelectedItem(null);
    const newRandomIndex = Math.floor(Math.random() * data.length);
    setRandomIndex(newRandomIndex);
    setIsRandomWord(false);
  };

  const handleRandom = () => {
    setSelectedItem(null);
    setQuery("");
    const newRandomIndex = Math.floor(Math.random() * data.length);
    setRandomIndex(newRandomIndex);
    setCurrentWordIndex(newRandomIndex);
    setIsRandomWord(false);
  };

  const handlePreviousWord = () => {
    const newIndex =
      currentWordIndex > 0 ? currentWordIndex - 1 : data.length - 1;
    setCurrentWordIndex(newIndex);
    const newWord = data[newIndex];
    setSelectedItem(newWord);
    setQuery(newWord.中文);
  };

  const handleNextWord = () => {
    const newIndex =
      currentWordIndex < data.length - 1 ? currentWordIndex + 1 : 0;
    setCurrentWordIndex(newIndex);
    const newWord = data[newIndex];
    setSelectedItem(newWord);
    setQuery(newWord.中文);
  };

  const handleShuffle = (newWord) => {
    setSelectedItem(newWord);
    setQuery(newWord.中文);
    const index = data.findIndex((word) => word.中文 === newWord.中文);
    setCurrentWordIndex(index !== -1 ? index : 0);
    setIsRandomWord(false);
  };

  const filteredData = selectedItem || (query ? results[0] : []);

  return (
    <PlaybackProvider>
      <div className="flex flex-col h-screen items-center justify-center relative">
        {/* Main Content Stack with top margin */}
        <div className="flex flex-col items-center w-full mt-[8%]">
          <Vinyl />
          <Title />
          <div className="my-4 w-full flex justify-center z-10">
            <SearchInput
              query={query}
              setQuery={setQuery}
              defaultText={placeholder?.中文}
              onSelect={handleSelect}
              results={results}
              onRandom={handleRandom}
              onConfirm={handleOpenModal}
              isModalOpen={showExplanation}
            />
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center w-full">
          <BlueCard
            show={showExplanation}
            onClose={handleCloseModal}
            data={filteredData}
            onShuffle={handleShuffle}
            onClearSearch={handleClearSearch}
          />
        </div>
        <Footer />
        {/* Particle Rain Background */}
        <ParticleRain />
      </div>
    </PlaybackProvider>
  );
}
