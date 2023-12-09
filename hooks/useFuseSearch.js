import { useState, useEffect } from "react";
import Fuse from "fuse.js";

const useFuseSearch = (data, query) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fuse = new Fuse(data, {
      keys: ["中文", "英文", "出处"],
      threshold: 0.2,
    });
    if (query) {
      const fuzzyResults = fuse.search(query);
      setResults(fuzzyResults.map((result) => result.item));
    } else {
      setResults([]);
    }
  }, [query, data]);

  return results;
};

export default useFuseSearch;
