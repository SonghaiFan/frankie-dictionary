"use client";
import { useState, useEffect } from "react";
import { data } from "@/public/data/data";
import BlueCard from "@/components/BlueCard";
import Footer from "@/components/Footer";
import useFuseSearch from "@/hooks/useFuseSearch";
import SearchInput from "@/components/SearchInput";
import Title from "@/components/Title";
import Vinyl from "@/components/Vinyl";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * data.length));
  }, []);

  const placeholder = data[randomIndex];
  const results = useFuseSearch(data, query);

  const handleSelect = (item) => {
    setShowExplanation(true);
    setSelectedItem(item);
    setQuery(item.中文);
  };

  const handleOpenModal = () => {
    if (results.length === 0 && query) {
      return;
    }

    if (results.length === 0 && !query) {
      setShowExplanation(true);
      setSelectedItem(placeholder);
      return;
    }

    if (results.length > 0 && results[0].中文 === query) {
      setShowExplanation(true);
      setSelectedItem(results[0]);
    }
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
    <div className="flex flex-col items-center justify-Stretch w-full mx-auto min-h-screen overflow-auto">
      <div className="mt-[2rem]">
        <Vinyl />
        <Title />
      </div>
      <div className="flex-grow" />
      <div className="h-[60%]">
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
    </div>
  );
}
