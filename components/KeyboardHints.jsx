import { motion } from "framer-motion";

// Modal version - shows word navigation and action shortcuts
function ModalKeyboardHints() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-4 text-center text-white/60 text-sm space-y-2 hidden md:block"
    >
      {/* Word Navigation Shortcuts */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
          <span>切换单词 / Navigate words</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd>
          <span>随机 / Random</span>
        </div>
      </div>

      {/* Action Shortcuts */}
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">H</kbd>
          <span>收藏 / Like</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">S</kbd>
          <span>分享 / Share</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">E</kbd>
          <span>导出 / Export</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Esc</kbd>
          <span>关闭 / Close</span>
        </div>
      </div>
    </motion.div>
  );
}

// Search version - shows search-specific shortcuts
function SearchKeyboardHints() {
  return (
    <div className="text-xs text-gray-400 text-center mt-3 space-y-1 hidden md:block">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘K</kbd>
          <span>搜索 / Search</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↑↓</kbd>
          <span>导航 / Navigate</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd>
          <span>切换 / Switch</span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>
          <span>选择 / Select</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd>
          <span>清除 / Clear</span>
        </div>
      </div>
    </div>
  );
}

// Export both components
export { ModalKeyboardHints, SearchKeyboardHints };

// Default export for backward compatibility
export default ModalKeyboardHints;
