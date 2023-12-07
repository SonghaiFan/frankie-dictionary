"use client";
// Home.js
import { useState, useEffect } from "react";
import { data } from "@/public/data";
import ExplanationModal from "@/components/ExplanationModal";
import Footer from "@/components/Footer";
import useFuseSearch from "@/hooks/useFuseSearch";
import SearchInput from "@/components/SearchInput";
import Quote from "@/components/Quote";
import Title from "@/components/Title";
import YouTubeMusicPlayer from "@/components/YoutubeMusic";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * data.length)
  );

  // useEffect(() => {
  //   setRandomIndex(Math.floor(Math.random() * data.length));
  // }, []);

  const placeholder = data[randomIndex];
  const results = useFuseSearch(data, query);

  const handleSelect = (item) => {
    // setShowExplanation(true);
    setSelectedItem(item);
    setQuery(item.中文);
  };

  const handleOpenModal = () => {
    setShowExplanation(true);
  };

  const handleCloseModal = () => {
    setShowExplanation(false);
    setSelectedItem(null);
  };

  const handleRandom = () => {
    setSelectedItem(null);
    setQuery("");
    setRandomIndex(Math.floor(Math.random() * data.length));
  };

  const filteredData = selectedItem || (query ? results[0] : placeholder);

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto p-4 h-screen">
      <Quote />
      <div className="mt-2">
        <Title />
      </div>
      <div className="mt-4 mb-8">
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
      <ExplanationModal
        show={showExplanation}
        onClose={handleCloseModal}
        data={filteredData}
      />
      <Footer />
      <YouTubeMusicPlayer />
    </div>
  );
}
