import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Dice3D from './Dice3D'; 


function Dice({ rollDice ,holdScore,isAiTurn,isRolling,setIsRolling }) {
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
            <div className='flex flex-col w-fit'>
                <button
                    onClick={handleRoll}
                    className=" text-xl mt-10 sm:mt-12 lg:mt-16 p-2 px-18 md:px-18 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7FB8E3] to-[#4178A7] text-white rounded-3xl w-full sm:w-auto disabled:opacity-50 hover:from-[#9EC9EB] hover:to-[#4A86B8]"                    
                    disabled={isRolling || isAiTurn}
                >
                    ROLL DICE
                </button>
                <button
                    onClick={holdScore}
                    className="text-xl mt-2 sm:mt-12 lg:mt-3 p-2 px-18 md:mt-2 sm:px-6 lg:px-22  bg-gradient-to-br from-[#63A07F] to-[#3A7552] text-white rounded-3xl w-full sm:w-auto disabled:opacity-50 hover:from-[#7BC69A] hover:to-[#4F8D68]"
                    disabled={isRolling || isAiTurn}
                >
                    HOLD SCORE
                </button>

            </div>

        </div>
    );
}

export default Dice;