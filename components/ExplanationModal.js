import { ImExit } from "react-icons/im";

const ExplanationModal = ({ show, onClose, data }) => {
  if (!show || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-kleinBlue text-white p-2 md:p-4 mb-4 w-full md:w-1/2 mx-4 rounded-lg shadow relative">
        <div className="p-2 md:p-4 text-left">
          <div
            className="font-bold text-2xl md:text-4xl mb-2 md:mb-8"
            style={{ fontFamily: "'Songti SC', serif" }}
          >
            {data.中文}
            <span className="text-sm md:text-2xl">({data.英文})</span>
          </div>
          <div className="text-sm md:text-xl mb-2 md:mb-4 ml-2 md:ml-20">
            {data.释义}
          </div>
          <hr className="mb-2" />
          <div className="text-xs md:text-sm text-right">-{data.出处}</div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-xl p-2 md:p-4 hover:bg-blue-600 focus:outline-none rounded-tr-lg"
        >
          <ImExit size={25} />
        </button>
      </div>
    </div>
  );
};

export default ExplanationModal;
