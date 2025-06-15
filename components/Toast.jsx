import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaInfo,
  FaExclamationTriangle,
} from "react-icons/fa";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <FaCheck size={16} />,
          iconColor: "text-green-300",
        };
      case "error":
        return {
          icon: <FaTimes size={16} />,
          iconColor: "text-red-300",
        };
      case "warning":
        return {
          icon: <FaExclamationTriangle size={16} />,
          iconColor: "text-yellow-300",
        };
      default: // info
        return {
          icon: <FaInfo size={16} />,
          iconColor: "text-blue-300",
        };
    }
  };

  const config = getToastConfig();

  const toastVariants = {
    initial: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      filter: "blur(2px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="
            fixed top-4 right-4 z-[200] 
            bg-kleinBlue/80 backdrop-blur-md
            text-white px-4 py-3 rounded-lg shadow-2xl
            border border-white/20
            max-w-sm min-w-[280px]
            flex items-center space-x-3
            font-light
          "
          style={{
            boxShadow:
              "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(19, 15, 148, 0.2)",
          }}
        >
          {/* Icon */}
          <div className={`${config.iconColor} flex-shrink-0`}>
            {config.icon}
          </div>

          {/* Message */}
          <div className="flex-1 text-sm leading-relaxed">{message}</div>

          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/70 hover:text-white transition-colors duration-200 flex-shrink-0 ml-2"
          >
            <FaTimes size={12} />
          </button>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
