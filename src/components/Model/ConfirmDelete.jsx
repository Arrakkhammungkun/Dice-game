
// eslint-disable-next-line no-unused-vars
import {motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDelete({
  isOpen,
  onConfirm,
  onCancel,
  title = 'ยืนยันการดำเนินการ',
  description = 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้?',
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={onCancel}
        >
          <motion.div
            className="bg-[#F5F2F4] rounded-lg shadow-lg p-4 max-w-xs sm:max-w-sm lg:max-w-md lg:p-8 w-full text-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#24243A]">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                onClick={onCancel}
                className="px-3 sm:px-8 py-1 sm:py-2 bg-gradient-to-br from-[#9CA3AF] to-[#6B7280] hover:from-[#A9B0BC] hover:to-[#7B8594] text-white rounded-3xl transition-all duration-300 shadow-md"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-br from-[#EF4444] to-[#DC2626] hover:from-[#F87171] hover:to-[#EF4444] text-white rounded-3xl transition-all duration-300 shadow-md"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
