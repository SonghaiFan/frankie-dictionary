import { useEffect, useState, useRef } from "react";
import { FaRegHeart, FaHeart, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import { cardVariants, cardTransition } from "@/utils/motion";
import html2canvas from "html2canvas";

const BlueCard = ({ show, onClose, data }) => {
  const [liked, setLiked] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);

  // LocalStorage functions
  const getLikedWords = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("blueDictionary_likedWords");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  };

  const saveLikedWords = (likedWords) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "blueDictionary_likedWords",
        JSON.stringify(likedWords)
      );
    }
  };

  const isWordLiked = (word) => {
    const likedWords = getLikedWords();
    return likedWords.some((likedWord) => likedWord.中文 === word.中文);
  };

  // Check if current word is liked when data changes
  useEffect(() => {
    if (data) {
      setLiked(isWordLiked(data));
    }
  }, [data]);

  const toggleLike = () => {
    if (!data) return;

    const likedWords = getLikedWords();
    const isCurrentlyLiked = isWordLiked(data);

    if (isCurrentlyLiked) {
      // Remove from liked words
      const updatedLikedWords = likedWords.filter(
        (word) => word.中文 !== data.中文
      );
      saveLikedWords(updatedLikedWords);
      setLiked(false);
    } else {
      // Add to liked words
      const updatedLikedWords = [...likedWords, data];
      saveLikedWords(updatedLikedWords);
      setLiked(true);
    }
  };

  // Export card as image
  const exportAsImage = async () => {
    if (!cardRef.current || !data) return;

    setIsExporting(true);

    try {
      // Hide buttons temporarily for clean export
      const buttons = cardRef.current.querySelectorAll("button");
      buttons.forEach((btn) => (btn.style.display = "none"));

      // Add watermark styling
      const originalStyle = cardRef.current.style.cssText;
      cardRef.current.style.position = "relative";

      // Create watermark
      const watermark = document.createElement("div");
      watermark.style.cssText = `
        position: absolute;
        top: 12px;
        right: 16px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        font-family: Inter, sans-serif;
        pointer-events: none;
        z-index: 1000;
      `;
      watermark.textContent = "蓝色词典 Blue Dictionary";
      cardRef.current.appendChild(watermark);

      // Capture the component directly
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#130f94", // kleinBlue background
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in cloned document
          const clonedElement = clonedDoc.querySelector("[data-card-ref]");
          if (clonedElement) {
            clonedElement.style.fontFamily = "'Noto Serif SC', serif";
          }
        },
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `蓝色词典-${data.中文}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      cardRef.current.removeChild(watermark);
      cardRef.current.style.cssText = originalStyle;
      buttons.forEach((btn) => (btn.style.display = ""));
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("导出失败，请重试 / Export failed, please try again");
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced heart animation variants
  const heartVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      filter: "drop-shadow(0 0 0px rgba(239, 68, 68, 0))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))",
      transition: {
        duration: 0.4,
        ease: "easeOut",
        rotate: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
    click: {
      scale: [1, 1.3, 0.9, 1],
      rotate: [0, 15, -10, 0],
      filter: [
        "drop-shadow(0 0 0px rgba(239, 68, 68, 0))",
        "drop-shadow(0 0 15px rgba(239, 68, 68, 0.8))",
        "drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))",
        "drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))",
      ],
      transition: {
        duration: 0.6,
        ease: "easeOut",
        times: [0, 0.3, 0.7, 1],
      },
    },
    liked: {
      scale: 1.05,
      filter: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Export button animation variants
  const exportVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      filter: "drop-shadow(0 0 0px rgba(34, 197, 94, 0))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    click: {
      scale: [1, 1.2, 0.95, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exporting: {
      rotate: 360,
      scale: 0.9,
      filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))",
      transition: {
        rotate: {
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        },
        scale: {
          duration: 0.3,
        },
      },
    },
  };

  const modalStyle = {
    opacity: show ? 1 : 0,
    zIndex: show ? 100 : -1,
    transition: "opacity 0.3s ease",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
      style={modalStyle}
    >
      {data && (
        <motion.div
          ref={cardRef}
          data-card-ref="true"
          className="relative bg-kleinBlue text-white w-full md:w-[50rem] h-[600px] md:h-[700px] mx-8 rounded-lg shadow origin-bottom-left"
          onClick={(e) => e.stopPropagation()}
          initial="hidden"
          animate={show ? "visible" : "exit"}
          variants={cardVariants}
          transition={cardTransition}
        >
          <motion.button
            initial="idle"
            animate={liked ? "liked" : "idle"}
            whileHover="hover"
            whileTap="click"
            variants={heartVariants}
            className="absolute top-2 right-2 text-red-500 px-4 py-2 rounded-md focus:outline-none"
            onClick={toggleLike}
          >
            <motion.div
              animate={liked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {liked ? <FaHeart size={25} /> : <FaRegHeart size={25} />}
            </motion.div>
          </motion.button>

          <motion.button
            initial="idle"
            animate={isExporting ? "exporting" : "idle"}
            whileHover={!isExporting ? "hover" : {}}
            whileTap={!isExporting ? "click" : {}}
            variants={exportVariants}
            className="absolute top-2 right-16 text-white-500 px-4 py-2 rounded-md focus:outline-none disabled:opacity-50"
            onClick={exportAsImage}
            disabled={isExporting}
            title={
              isExporting
                ? "导出中... / Exporting..."
                : "导出图片 / Export Image"
            }
          >
            <FaDownload size={22} />
          </motion.button>

          <div className="flex flex-col h-full min-h-[500px] pl-4 pr-8 py-4 md:pl-6 md:pr-12 md:py-6 text-left">
            {/* Top section with words */}
            <div className="space-y-6">
              {/* Chinese word - large and prominent */}
              <div className="text-6xl md:text-8xl font-light leading-none noto-serif-sc-regular">
                {data.中文}
              </div>

              {/* English word */}
              <div className="text-2xl md:text-4xl font-light tracking-wider noto-serif-sc-regular">
                {data.英文}
              </div>
            </div>

            {/* Middle section with definitions */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-lg md:text-2xl font-light leading-relaxed noto-serif-sc-regular">
                释义：{data.释义}
              </div>
              {data.英文释义 && (
                <div className="text-base md:text-xl leading-relaxed opacity-90 homemade-apple-regular">
                  Paraphrase: {data.英文释义}
                </div>
              )}
            </div>

            {/* Bottom section with logo and source */}
            <div className="flex justify-between items-end mt-8">
              {/* Large first letter of English word with random rotation */}
              <div
                className="text-8xl md:text-9xl font-bold opacity-80 homemade-apple-regular"
                style={{
                  transform: `rotate(${
                    (data.英文 && data.英文.length > 0
                      ? data.英文.charCodeAt(0) % 21
                      : 0) - 10
                  }deg)`,
                }}
              >
                {data.英文 && data.英文.length > 0
                  ? data.英文.charAt(0).toUpperCase()
                  : "A"}
              </div>

              {/* Source attribution */}
              <div className="text-right">
                <div className="text-sm font-light">- {data.出处}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BlueCard;
