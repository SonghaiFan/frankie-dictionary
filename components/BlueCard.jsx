import { useEffect, useState, useRef } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaDownload,
  FaRandom,
  FaShare,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { cardVariants, cardTransition } from "@/utils/motion";
import html2canvas from "html2canvas";
import { data } from "@/public/data/data";
import { ModalKeyboardHints } from "./KeyboardHints";

const BlueCard = ({
  show,
  onClose,
  data: currentData,
  onShuffle,
  onClearSearch,
}) => {
  const [liked, setLiked] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef(null);

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState({ x: null, y: null });
  const [touchEnd, setTouchEnd] = useState({ x: null, y: null });

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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
    if (currentData) {
      setLiked(isWordLiked(currentData));
    }
  }, [currentData]);

  // Touch event handlers for swipe detection
  const onTouchStart = (e) => {
    setTouchEnd({ x: null, y: null }); // otherwise the swipe is fired even with usual touch events
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x || !touchStart.y || !touchEnd.y) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Prioritize vertical swipes over horizontal ones
    if (Math.abs(distanceY) > Math.abs(distanceX)) {
      if (isDownSwipe) {
        // Swipe down = close modal
        handleClose();
      }
    } else {
      // Horizontal swipes for navigation
      if (isLeftSwipe) {
        // Swipe left = next word
        handleNextWord();
      } else if (isRightSwipe) {
        // Swipe right = previous word
        handlePreviousWord();
      }
    }
  };

  const handleClose = () => {
    onClose();
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      // Only handle modal-specific shortcuts when modal is open
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          handlePreviousWord();
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          handleNextWord();
          break;
        case " ":
          e.preventDefault();
          handleShuffle();
          break;
        case "h":
        case "H":
          e.preventDefault();
          toggleLike();
          break;
        case "e":
        case "E":
          e.preventDefault();
          exportAsImage();
          break;
        case "s":
        case "S":
          e.preventDefault();
          shareWord();
          break;
        case "Escape":
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, currentData, onClose, onClearSearch]);

  const getCurrentIndex = () => {
    if (!currentData) return 0;
    return data.findIndex((item) => item.中文 === currentData.中文);
  };

  const handlePreviousWord = () => {
    const currentIndex = getCurrentIndex();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : data.length - 1;
    const previousWord = data[previousIndex];
    if (onShuffle) {
      onShuffle(previousWord);
    }
  };

  const handleNextWord = () => {
    const currentIndex = getCurrentIndex();
    const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
    const nextWord = data[nextIndex];
    if (onShuffle) {
      onShuffle(nextWord);
    }
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomWord = data[randomIndex];
    if (onShuffle) {
      onShuffle(randomWord);
    }
  };

  const toggleLike = () => {
    if (!currentData) return;

    const likedWords = getLikedWords();
    const isCurrentlyLiked = isWordLiked(currentData);

    if (isCurrentlyLiked) {
      // Remove from liked words
      const updatedLikedWords = likedWords.filter(
        (word) => word.中文 !== currentData.中文
      );
      saveLikedWords(updatedLikedWords);
      setLiked(false);
    } else {
      // Add to liked words
      const updatedLikedWords = [...likedWords, currentData];
      saveLikedWords(updatedLikedWords);
      setLiked(true);
    }
  };

  // Share word function
  const shareWord = async () => {
    if (!currentData) return;

    setIsSharing(true);

    try {
      const shareUrl = `${window.location.origin}?word=${encodeURIComponent(
        currentData.中文
      )}`;

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: `蓝色词典 - ${currentData.中文}`,
          text: `${currentData.中文} (${currentData.英文}) - ${currentData.释义}`,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);

        // Show a temporary notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-kleinBlue text-white px-4 py-2 rounded-lg shadow-lg z-[200] transition-all duration-300";
        notification.textContent =
          "链接已复制到剪贴板 / Link copied to clipboard";
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: try to copy URL to clipboard
      try {
        const shareUrl = `${window.location.origin}?word=${encodeURIComponent(
          currentData.中文
        )}`;
        await navigator.clipboard.writeText(shareUrl);

        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-kleinBlue text-white px-4 py-2 rounded-lg shadow-lg z-[200] transition-all duration-300";
        notification.textContent =
          "链接已复制到剪贴板 / Link copied to clipboard";
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 2000);
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError);
        alert("分享失败，请重试 / Share failed, please try again");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Export card as image
  const exportAsImage = async () => {
    if (!cardRef.current || !currentData) return;

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
      link.download = `蓝色词典-${currentData.中文}.png`;
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

  // Share button animation variants
  const shareVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      filter: "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    click: {
      scale: [1, 1.2, 0.95, 1],
      rotate: [0, 10, -5, 0],
      filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    sharing: {
      scale: 0.9,
      filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))",
      transition: {
        duration: 0.3,
      },
    },
  };

  // Shuffle button animation variants
  const shuffleVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      filter: "drop-shadow(0 0 0px rgba(168, 85, 247, 0))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    click: {
      scale: [1, 1.2, 0.95, 1],
      rotate: [0, 180, 360],
      filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))",
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Close button animation variants
  const closeVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      filter: "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      rotate: 90,
      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    click: {
      scale: [1, 1.2, 0.95, 1],
      rotate: [0, 180, 360],
      filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))",
      transition: {
        duration: 0.4,
        ease: "easeOut",
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
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur flex flex-col items-center justify-center z-50"
      onClick={handleClose}
      style={modalStyle}
    >
      {currentData && (
        <>
          <motion.div
            ref={cardRef}
            data-card-ref="true"
            className="relative bg-kleinBlue text-white w-full md:w-[50rem] h-[600px] md:h-[700px] mx-8 rounded-lg shadow origin-bottom-left"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            initial="hidden"
            animate={show ? "visible" : "exit"}
            variants={cardVariants}
            transition={cardTransition}
          >
            {/* Action buttons - vertical on mobile, horizontal on desktop */}
            <div className="absolute top-2 right-2 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
              <motion.button
                initial="idle"
                whileHover="hover"
                whileTap="click"
                variants={closeVariants}
                className="text-white/20 px-3 py-3 md:px-4 md:py-2 rounded-md focus:outline-none disabled:opacity-50"
                onClick={handleClose}
                title="关闭 (Esc) / Close"
              >
                <FaTimes size={20} />
              </motion.button>

              <motion.button
                initial="idle"
                animate={isExporting ? "exporting" : "idle"}
                whileHover={!isExporting ? "hover" : {}}
                whileTap={!isExporting ? "click" : {}}
                variants={exportVariants}
                className="text-white/20 px-3 py-3 md:px-4 md:py-2 rounded-md focus:outline-none disabled:opacity-50"
                onClick={exportAsImage}
                disabled={isExporting}
                title={
                  isExporting
                    ? "导出中... / Exporting..."
                    : "导出图片 (E) / Export Image"
                }
              >
                <FaDownload size={20} />
              </motion.button>

              <motion.button
                initial="idle"
                animate={isSharing ? "sharing" : "idle"}
                whileHover={!isSharing ? "hover" : {}}
                whileTap={!isSharing ? "click" : {}}
                variants={shareVariants}
                className="text-white/20 px-3 py-3 md:px-4 md:py-2 rounded-md focus:outline-none disabled:opacity-50"
                onClick={shareWord}
                disabled={isSharing}
                title={
                  isSharing
                    ? "分享中... / Sharing..."
                    : "分享单词 (S) / Share Word"
                }
              >
                <FaShare size={18} />
              </motion.button>

              <motion.button
                initial="idle"
                whileHover="hover"
                whileTap="click"
                variants={shuffleVariants}
                className="text-white/20 px-3 py-3 md:px-4 md:py-2 rounded-md focus:outline-none"
                onClick={handleShuffle}
                title="随机单词 (Space) / Random Word"
              >
                <FaRandom size={18} />
              </motion.button>

              <motion.button
                initial="idle"
                animate={liked ? "liked" : "idle"}
                whileHover="hover"
                whileTap="click"
                variants={heartVariants}
                className="text-red-500 px-3 py-3 md:px-4 md:py-2 rounded-md focus:outline-none"
                onClick={toggleLike}
                title={liked ? "取消收藏 (H)" : "收藏单词 (H)"}
              >
                <motion.div
                  animate={liked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {liked ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
                </motion.div>
              </motion.button>
            </div>

            <div className="flex flex-col h-full min-h-[500px] pl-4 pr-8 py-4 md:pl-6 md:pr-12 md:py-6 text-left">
              {/* Top section with words */}
              <div className="space-y-6">
                {/* Chinese word - large and prominent */}
                <div className="text-6xl md:text-8xl font-light leading-none noto-serif-sc-regular">
                  {currentData.中文}
                </div>

                {/* English word */}
                <div className="text-2xl md:text-4xl font-light tracking-wider noto-serif-sc-regular">
                  {currentData.英文}
                </div>
              </div>

              {/* Middle section with definitions */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="text-lg md:text-2xl font-light leading-relaxed noto-serif-sc-regular">
                  释义：{currentData.释义}
                </div>
                {currentData.英文释义 && (
                  <div className="text-base md:text-xl leading-relaxed opacity-90 homemade-apple-regular">
                    Paraphrase: {currentData.英文释义}
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
                      currentData.英文 && currentData.英文.length > 0
                        ? (currentData.英文.charCodeAt(0) % 21) - 10
                        : 0
                    }deg)`,
                  }}
                >
                  {currentData.英文 && currentData.英文.length > 0
                    ? currentData.英文.charAt(0).toUpperCase()
                    : "A"}
                </div>

                {/* Source attribution */}
                <div className="text-right">
                  <div className="text-sm font-light">- {currentData.出处}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modal Keyboard Hints */}
          <ModalKeyboardHints />
        </>
      )}
    </div>
  );
};

export default BlueCard;
