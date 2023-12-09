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
          <div className="relative bg-white p-5 m-5 rounded-lg md:w-[50rem]">
            <button
              onClick={toggleModal}
              className="absolute top-0 right-0 text-2xl md:text-3xl p-2 md:p-4 hover:scale-110 transition-all rounded-tr-lg"
            >
              <IoClose />
            </button>

            <h2 className="text-xl md:text-3xl mb-2 text-left">
              关于蓝色词典
              <span className="mb-4 text-kleinBlue"> Blue Dictionary® </span>
            </h2>

            <div className="mb-[2.25rem]" />
            <div className="text-xs md:text-sm mb-2">
              <p className="mb-2">
                在语言的众多层次中，词作为最基本的构成单元，其内涵和外延常被固化于传统的辞典解释之中。然而，语言作为一种动态而复杂的符号系统，其内在的涵义远远超出了表面的字面意义。蓝色词典旨在探索并挑战这种传统的词义固化，通过解构视角重塑词汇的定义。
              </p>
              <hr className="mb-4" />
              <p className="mb-2">
                Music by{" "}
                <a
                  href="https://purrplecat.com/"
                  className="text-blue-500 underline"
                >
                  Purrple Cat
                </a>
              </p>
              <p className="mb-2">
                Music promoted by{" "}
                <a
                  href="https://www.chosic.com/free-music/all/"
                  className="text-blue-500 underline"
                >
                  Chosic
                </a>
              </p>
              <p className="mb-2">
                Creative Commons{" "}
                <a
                  href="https://creativecommons.org/licenses/by/3.0/"
                  className="text-blue-500 underline"
                >
                  CC BY 3.0
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
