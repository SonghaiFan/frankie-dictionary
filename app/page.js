"use client";
import { useState, useEffect, useCallback } from "react";
import Fuse from "fuse.js";
import { data } from "@/public/data";
import { BsSearchHeart } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import { FaDice } from "react-icons/fa";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [placeholder, setPlaceholder] = useState([]);

  useEffect(() => {
    const options = {
      keys: ["中文", "英文", "解释"],
      threshold: 0.3,
    };
    setFuse(new Fuse(data, options));
    // Set a random placeholder on initial load
    setPlaceholder(data[Math.floor(Math.random() * data.length)]);
  }, []);

  useEffect(() => {
    if (fuse && query) {
      const fuzzyResults = fuse.search(query);
      setResults(fuzzyResults.map((result) => result.item));
    } else {
      setResults([]);
    }
    setShowExplanation(false);
  }, [query, fuse]);

  const handleSelect = useCallback((item) => {
    setSelectedItem(item);
    setQuery(item.中文);
  }, []);

  const handleShowExplanation = useCallback(() => {
    setShowExplanation(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowExplanation(false);
    setSelectedItem(null);
    setQuery("");
  }, []);

  const handleRandom = () => {
    setSelectedItem(null);
    setQuery("");
    setPlaceholder(data[Math.floor(Math.random() * data.length)]);
  };

  const defaultData = query ? [results[0]] : [placeholder];

  const filteredData = selectedItem ? [selectedItem] : defaultData;

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto p-4 h-screen">
      {/* a qutation  */}
      <div className="fixed top-10 text-sm md:text-xl mb-2 md:mb-4 ml-2 md:ml-20 italic border-l-4 border-blue-500 pl-4">
        {/* add date */}
        <q className="quotes">你按响门铃，我说欢迎光临。</q>
      </div>

      <h1
        className="text-4xl md:text-6xl font-bold mb-2"
        style={{ fontFamily: "'Songti SC', serif" }}
      >
        蓝字典
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold mb-4 text-blue-800 font-sans">
        Blue Dictionary®
      </h2>
      <div className="mb-4 sm:w-1/3 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="relative w-[300px] mb-4 md:mb-0 md:mr-8">
            <div className="flex border border-gray-300 rounded-md px-2 md:px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="flex-grow focus:outline-none px-2 md:px-4"
                placeholder={placeholder.中文}
              />
            </div>
            {query && (
              <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-[5rem] rounded-md overflow-auto z-10">
                {results.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="cursor-pointer hover:bg-gray-200 px-4 py-2"
                  >
                    {item.中文}{" "}
                    <span className="text-sm text-gray-400">
                      -{item.英文}-{item.出处}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-row mt-[10rem] sm:mt-auto">
            <button
              onClick={handleShowExplanation}
              className="bg-kleinBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none ml-2"
            >
              <BsSearchHeart size={25} />
            </button>
            <button
              onClick={handleRandom}
              className="bg-kleinBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none ml-2"
            >
              <FaDice size={25} />
            </button>
          </div>
        </div>
      </div>
      {showExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-kleinBlue text-white p-2 md:p-4 mb-4 w-full md:w-1/2 mx-4 rounded-lg shadow relative">
            {filteredData.map((item, index) => (
              <div key={index} className="p-2 md:p-4 text-left">
                <div
                  className="font-bold text-2xl md:text-4xl mb-2 md:mb-8"
                  style={{ fontFamily: "'Songti SC', serif" }}
                >
                  {item.中文}{" "}
                  <span className="text-sm md:text-2xl">({item.英文})</span>
                </div>
                <div className="text-sm md:text-xl mb-2 md:mb-4 ml-2 md:ml-20">
                  {item.释义}
                </div>
                <hr className="mb-2" />
                <div className="text-xs md:text-sm text-right">
                  -{item.出处}
                </div>
              </div>
            ))}
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 text-xl p-2 md:p-4 hover:bg-blue-600 focus:outline-none rounded-tr-lg"
            >
              <ImExit size={25} />
            </button>
          </div>
        </div>
      )}
      <footer className="fixed bg-kleinBlue text-white text-center p-2 md:p-4 bottom-0 w-full">
        <div>
          <span>贡献者: </span>
          <a className="text-blue-300 ">(海</a>
          <span> | </span>
          <a className="text-blue-300 ">海苔)</a>
          <span> & All</span>
        </div>
      </footer>
    </div>
  );
}
