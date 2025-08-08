import { useEffect, useCallback } from "react";
import React from "react";


export default React.memo(function GameSettings({ names, setNames, target, setTarget, gameMode, setGameMode, aiDifficulty, setAiDifficulty }) {
  const handleNameChange = useCallback((value) => {
    setNames([value, names[1]]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names[1], setNames]);

  useEffect(() => {
    if (gameMode === 'vsAI') {
      const difficultyName = aiDifficulty
        ? aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)
        : 'Easy';
      setNames((prev) => [prev[0], `AI [${difficultyName}]`]);
    } else {
        setNames((prev) => {
        const newNames = [prev[0], 'Player 2'];
       
        return newNames;
      });
    }
  }, [gameMode, aiDifficulty, setNames]);

  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2">
        <hr className="border-1 w-1/4 sm:w-1/3 border-[#F5F2F4]" />
        <p className="text-[#F5F2F4] text-base sm:text-md font-mono px-2 sm:px-4  whitespace-nowrap">
          Game Setting
        </p>
        <hr className="border-1 w-1/4 sm:w-1/3 border-[#F5F2F4]" />
      </div>
      <div className="p-1 sm:p-2">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">Game Mode:</label>
        <select
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value)}
className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563] text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-[#966099] z-10"        >
          <option value="2player">2 Players</option>
          <option value="vsAI">Vs AI</option>
        </select>
      </div>
      {gameMode === 'vsAI' && (
        <div className="p-1 sm:p-2">
          <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">AI Difficulty:</label>
          <select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563] text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-[#966099] z-10"          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      <div className="p-1 sm:p-2">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">Target Score:</label>
        <select
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563] text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-[#966099] z-10"        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
        </select>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2">
        <hr className="border-1 w-1/4 sm:w-1/3 border-[#F5F2F4]" />
        <p className="text-[#F5F2F4] text-base sm:text-md font-mono px-2 sm:px-4  whitespace-nowrap">
          Player Setting
        </p>
        <hr className="border-1 w-1/4 sm:w-1/3 border-[#F5F2F4]" />
      </div>
      <div className="p-1 sm:p-2">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">Player 1 Name</label>
        <input
          type="text"
          value={names[0]}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563] text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-[#966099] z-10"
          autoFocus
        />
      </div>
      {gameMode !== 'vsAI' && (
        <div className="p-1 sm:p-2">
          <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">Player 2 Name:</label>
          <input
            type="text"
            value={names[1]}
            onChange={(e) => setNames([names[0], e.target.value])}
className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563] text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-[#966099] z-10"          />
        </div>
      )}

    </div>
  );
});