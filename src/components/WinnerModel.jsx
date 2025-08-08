import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WinnerModal({ winner, winnerScore, onClose }) {
  // จัดการกรณี winner หรือ winnerScore เป็น undefined
  const displayName = winner || 'Unknown Player';
  const displayScore = winnerScore !== undefined ? winnerScore : 0;

  return (
    <AnimatePresence>
      <motion.div
        key={displayName + displayScore} // ใช้ key ที่ไม่ซ้ำโดยรวม score
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.div
          className="bg-[#F5F2F4] rounded-lg shadow-lg p-4 max-w-xs sm:max-w-sm lg:max-w-md lg:p-8 w-full text-center relative"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#479586]">YOU WON!</h2>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#24243A]">{displayName}</h2>
          <p className="text-md sm:text-xl mb-6 text-[#24243A]">Score: {displayScore}</p>
          <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-4 lg:mt-12">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-[#858e9c] text-white rounded hover:bg-[#6B7280]"
            >
              BACK TO MENU
            </button>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-[#FFD700] text-white rounded hover:bg-[#E8C83E]"
            >
              New Game
            </button>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes popIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}