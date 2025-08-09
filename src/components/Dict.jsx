import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Dice3D from './Dice3D';
// const icon_Dice = img('/icon/dice.png')

function Dice({ rollDice, holdScore, isAiTurn, isRolling, setIsRolling }) {
    // เลือกสุ่มลูกเต๋า
    const handleRoll = () => {
        if (isRolling || isAiTurn) return;
        setIsRolling(true);
    };
    //เก็บคะแนน
    const handleResult = (value) => {
        setIsRolling(false);
        if (rollDice) rollDice(value);
    };
    ;
    return (
        <div className=" container  mt-4 flex flex-col items-center">
            <Dice3D isRolling={isRolling} onRoll={handleResult} />
            <div className="flex flex-col items-center gap-4 mt-10 sm:mt-12 lg:mt-16">
                <button
                    onClick={handleRoll}
                    className="flex items-center justify-center gap-2 text-xl p-2 sm:px-6 lg:px-8 
               min-w-[220px]
               bg-gradient-to-br from-[#7FB8E3] to-[#4178A7] 
               text-white rounded-3xl 
               disabled:opacity-50 
               hover:from-[#9EC9EB] hover:to-[#4A86B8]"
                    disabled={isRolling || isAiTurn}
                >
                    <img src="icon/dice.png" alt="dice" className="w-8 h-8" />
                    ROLL DICE
                </button>

                <button
                    onClick={holdScore}
                    className="flex items-center justify-center gap-2 text-xl p-2 sm:px-6 lg:px-8 
               min-w-[220px]
               bg-gradient-to-br from-[#63A07F] to-[#3A7552] 
               text-white rounded-3xl 
               disabled:opacity-50 
               hover:from-[#7BC69A] hover:to-[#4F8D68]"
                    disabled={isRolling || isAiTurn}
                >
                    <img src="icon/bank1.png" alt="hold" className="w-8 h-8" />
                    HOLD SCORE
                </button>
            </div>


        </div>
    );
}

export default Dice;