import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const ClaimRewardModal = ({ isOpen, onClose, achievement }) => {
  return (
    <AnimatePresence>
      {isOpen && achievement && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 min-h-screen"
          onClick={onClose}
        >
          <motion.div
            className="bg-[#1C2126] rounded-lg shadow-lg p-3 sm:p-6 w-11/12 sm:max-w-md text-center relative overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-mono text-[#F5F2F4]">
                รางวัล: {achievement.name}
              </h2>
              <button
                onClick={onClose}
                className="text-[#F5F2F4] hover:text-[#9CABBA] focus:outline-none"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg sm:text-xl" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#F5F2F4] mb-3 sm:mb-4">{achievement.description}</p>
            <p className="text-xs sm:text-sm text-[#4B8A65] font-bold mb-4 sm:mb-6">รางวัลได้รับเรียบร้อย!</p>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-br from-[#4B8A65] to-[#3B6A50] hover:from-[#5F9F7A] hover:to-[#4B8A65] text-white rounded-3xl transition-all duration-300 shadow-md text-xs sm:text-sm"
              >
                ปิด
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClaimRewardModal;