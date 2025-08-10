import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

function RoundWinnerModal({ roundWinner, roundNumber, onClose }) {
  const displayName = roundWinner || 'Unknown Player';

  return (
    <AnimatePresence>
      <motion.div
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#479586]">Round {roundNumber} Winner!</h2>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#24243A]">{displayName}</h2>
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-br from-[#63A07F] to-[#3A7552] text-white rounded hover:from-[#7BC69A] hover:to-[#4F8D68]"
          >
            Next Round
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RoundWinnerModal;