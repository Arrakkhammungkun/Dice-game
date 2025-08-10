import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

function WinnerModal({ winner, winnerScore, scores, onClose, gameMode, tournamentOver }) {
  const displayName = winner || 'Unknown Player';
  const displayScore = winnerScore !== undefined ? winnerScore : 0;

  return (
    <AnimatePresence>
      <motion.div
        key={displayName + displayScore}
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#479586]">
            {gameMode === 'tournament' && tournamentOver ? 'Tournament Winner!' : 'Game Over!'}
          </h2>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#24243A]">{displayName}</h2>

          <div className="flex justify-center gap-4 mb-4 text-xl sm:text-2xl">
            <p className="text-[#E1A6E4]">{scores[0]}</p>
            <p>:</p>
            <p className="text-[#83FFE7]">{scores[1]}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-[#FFD700] text-white rounded hover:bg-[#E8C83E]"
          >
            New Game
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default WinnerModal;