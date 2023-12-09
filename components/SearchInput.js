import { BsSearchHeart } from "react-icons/bs";
import { FaDice } from "react-icons/fa";
import { PiEraserFill } from "react-icons/pi";

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
    <div className="mb-4 w-full flex-row items-center m-auto">
      <div className="flex flex-col md:flex-row items-center ">
        <div className="relative mb-4 md:mb-0 md:mr-8">
          <div className="flex border border-gray-300 rounded-md">
            <input
              className="flex-grow px-2 py-2 focus:outline-none rounded-l-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder={defaultText}
            />
            <button
              onClick={onConfirm}
              className="bg-kleinBlue text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none transition-all ease-in-out duration-300"
            >
              <BsSearchHeart size={25} />
            </button>
          </div>

          {query && (
            <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-[10rem] rounded-md overflow-auto z-10">
              {results.length === 0 ? (
                <li className="px-4 py-2 text-gray-600">未找到相关词条</li>
              ) : (
                results.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => onSelect(item)}
                    className="cursor-pointer hover:bg-gray-200 px-4 py-2 transition-all ease-in-out duration-300"
                  >
                    {item.中文}{" "}
                    <span className="text-sm text-gray-400">-{item.出处}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="flex flex-row gap-5 mt-[5rem] md:mt-auto">
          <button
            onClick={onRandom}
            className="bg-kleinBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none transition-all ease-in-out duration-300"
          >
            {query ? <PiEraserFill size={25} /> : <FaDice size={25} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
