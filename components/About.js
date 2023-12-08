import { useState } from "react";
import { MdQuestionMark } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className="fixed top-5 left-3">
        <button
          className="text-xl p-2 rounded-lg bg-kleinBlue"
          aria-label="About"
          onClick={toggleModal}
        >
          <MdQuestionMark className="text-white" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative bg-white p-5 rounded-lg md:w-1/3">
            <button
              onClick={toggleModal}
              className="absolute top-0 right-0 text-2xl md:text-3xl p-2 md:p-4 hover:bg-gray-300 focus:outline-none rounded-tr-lg"
            >
              <IoClose />
            </button>

            <h2 className="text-xl md:text-3xl mb-2 text-left">
              关于蓝字典
              <span className=" font-bold mb-4 text-blue-800 font-sans">
                Blue Dictionary®
              </span>
            </h2>

            <hr className="mb-4" />
            <div className="mb-[2.25rem]" />
            <p className="mb-2 text-sm md:text-base">
              在语言的众多层次中，词作为最基本的构成单元，其内涵和外延常被固化于传统的辞典解释之中。然而，语言作为一种动态而复杂的符号系统，其内在的涵义远远超出了表面的字面意义。蓝字典旨在探索并挑战这种传统的词义固化，通过解构视角重塑词汇的定义。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
