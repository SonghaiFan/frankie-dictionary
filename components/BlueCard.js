import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { cardVariants, cardTransition, heartVariants } from "@/utils/motion";

const BlueCard = ({ show, onClose, data }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(false);
  }, [data]);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const modalStyle = {
    opacity: show ? 1 : 0,
    zIndex: show ? 100 : -1,
    transition: "opacity 0.3s ease",
  };

  const cardStyle = {
    transformOrigin: "left bottom",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
      style={modalStyle}
    >
      <motion.div
        className="relative bg-kleinBlue text-white p-2 md:p-4 mb-4 w-full md:w-1/2 mx-4 rounded-lg shadow"
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        animate={show ? "visible" : "exit"}
        style={cardStyle}
        variants={cardVariants}
        transition={cardTransition}
      >
        {data && (
          <>
            <div className="p-2 md:p-4 text-left">
              <div
                className="font-light text-2xl md:text-4xl mb-2 md:mb-8"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                {data.中文}
                <span className="text-sm md:text-2xl">({data.英文})</span>
              </div>
              <div className="font-thin text-sm md:text-xl mb-2 md:mb-4 ml-[2rem] md:ml-[5rem]">
                {data.释义}
              </div>
              <hr className="mb-2" />
              <div className="text-xs md:text-sm text-right">-{data.出处}</div>
            </div>
            <motion.button
              whileHover="hover"
              whileTap="click"
              variants={heartVariants}
              className="bg-kleinBlue text-red-500 px-4 py-2 rounded-md"
              onClick={toggleLike}
            >
              {liked ? <FaHeart size={25} /> : <FaRegHeart size={25} />}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BlueCard;
