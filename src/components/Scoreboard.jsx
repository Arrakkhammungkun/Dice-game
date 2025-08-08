// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 
import React from 'react';

function Scoreboard({ scores, currentScore, playerNames, currentPlayer }) {
  return (
    <div className=" flex justify-center  ">
        <div className='  flex p-6   max-w-md sm:max-w-xl md:max-w-4xl sm:min-h-72 w-full justify-center'>
            <div className="flex flex-row gap-4 sm:gap-2 lg:gap-6  sm:flex-row  md:space-y-0 md:space-x-4">
            {scores.map((score, index) => (
                <div
                    key={index}
                    className={`  p-4 rounded-lg shadow-md text-center w-full md:w-96  ${
                    index === 0 ? 'bg-[#966099]' : 'bg-[#479586]'
                    } ${
                        index === currentPlayer ? 'border-2 border-[#F5F2F4] glow ' : ''
                    }
                    ${index !== currentPlayer ? 'opacity-60 ' : ''}
                    `}
                    
                    >
                    <h3 className="text-base md:text-3xl font-bold mb-1 text-[#ffff]">{playerNames[index]}</h3>
                    <p className="text-xs md:text-sm text-[#D1D5DB]">Total Score</p>
                    <p className={`text-3xl  md:text-6xl font-bold mb-2 md:mb-6 ${
                        index === 0 ? 'text-[#E1A6E4]' : 'text-[#83FFE7]'
                    }`}
                        >
                            {score}</p>
                    <p className="text-xs md:text-sm text-[#D1D5DB] whitespace-nowrap">Current Score</p>
                    {index === currentPlayer ? (
                    <motion.p
                        key={currentScore} 
                        initial={{ scale: 1 }}
                        animate={{ scale: [1.2, 0.95, 1.05, 1] }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`text-2xl md:text-4xl font-bold ${
                        index === 0 ? 'text-[#E1A6E4]' : 'text-[#83FFE7]'
                        }`}
                    >
                        {currentScore}
                    </motion.p>
                    ) : (
                    <p className={`text-2xl md:text-4xl font-bold ${
                        index === 0 ? 'text-[#E1A6E4]' : 'text-[#83FFE7]'
                    }`}>
                        0
                    </p>
                    )}
                </div>
            ))}


        </div>    
        </div>

    </div>
  );
}

export default Scoreboard;