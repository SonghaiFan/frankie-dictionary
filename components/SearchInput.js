import { BsSearchHeart } from "react-icons/bs";
import { FaDice } from "react-icons/fa";

const SearchInput = ({
  query,
  setQuery,
  defaultText,
  onSelect,
  results,
  onRandom,
  onConfirm,
}) => {
  return (
    <div className="mb-4 w-full">
      <div className="flex flex-col md:flex-row items-center ">
        <div className="relative mb-4 md:mb-0 md:mr-8">
          <input
            className="flex flex-grow border border-gray-300 rounded-md px-2 md:px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder={defaultText}
          />
          {query && (
            <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-[10rem] rounded-md overflow-auto z-10">
              {results.map((item, index) => (
                <li
                  key={index}
                  onClick={() => onSelect(item)}
                  className="cursor-pointer hover:bg-gray-200 px-4 py-2"
                >
                  {item.中文}{" "}
                  <span className="text-sm text-gray-400">-{item.出处}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-row gap-5 mt-[15rem] md:mt-auto">
          <button
            onClick={onRandom}
            className="bg-kleinBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none "
          >
            <FaDice size={25} />
          </button>
          <button
            onClick={onConfirm}
            className="bg-kleinBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none "
          >
            <BsSearchHeart size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
