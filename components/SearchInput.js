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
    <div className="mb-4 w-full flex-row items-center  m-auto">
      <div className="flex flex-col md:flex-row">
        <div className="relative mb-4 md:mb-0 md:mr-8">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={onConfirm}
              className="bg-kleinBlue text-white px-4 py-2 rounded-l-md hover:bg-blue-600 focus:outline-none"
            >
              <BsSearchHeart size={25} />
            </button>
            <input
              className="flex-grow px-2 py-2 focus:outline-none rounded-l-md"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder={defaultText}
            />
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
                    className="cursor-pointer hover:bg-gray-200 px-4 py-2"
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
            className="bg-kleinBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none "
          >
            {query ? <PiEraserFill size={25} /> : <FaDice size={25} />}
          </button>
        </div>
      </div>
      <div className=" mt-5 md:text-sm text-xs italic border-l-4 border-blue-500 pl-4">
        <q className="quotes">使用指南：请勿在夜晚翻阅。</q>
      </div>
    </div>
  );
};

export default SearchInput;
