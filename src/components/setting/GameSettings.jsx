import { useEffect, useCallback } from "react";
import React from "react";

// GameSettings.jsx
export default React.memo(function GameSettings({ names, setNames, target, setTarget, gameMode, setGameMode, aiDifficulty, setAiDifficulty }) {
  const handleNameChange = useCallback((value) => {
    setNames([value, names[1]]);
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
        console.log('Setting names for 2player:', newNames);
        return newNames;
      });
    }
  }, [gameMode, aiDifficulty, setNames]);

  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2">
        <hr className="border-1 w-1/4 sm:w-1/3 border-black" />
        <p className="text-[#24243A] text-base sm:text-md font-mono px-2 sm:px-4  whitespace-nowrap">
          Game Setting
        </p>
        <hr className="border-1 w-1/4 sm:w-1/3 border-black" />
      </div>
      <div className="p-1 sm:p-2">
        <label className="block mb-1 text-xs sm:text-sm font-semibold">Game Mode:</label>
        <select
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-white border-[#D1D5DB] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#479586]"
        >
          <option value="2player">2 Players</option>
          <option value="vsAI">Vs AI</option>
        </select>
      </div>
      {gameMode === 'vsAI' && (
        <div className="p-1 sm:p-2">
          <label className="block mb-1 text-xs sm:text-sm font-semibold">AI Difficulty:</label>
          <select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
            className="w-full p-2 sm:p-3 border-2 rounded-xl bg-white border-[#D1D5DB] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#479586]"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      <div className="p-1 sm:p-2">
        <label className="block mb-1 text-xs sm:text-sm font-semibold">Target Score:</label>
        <select
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-white border-[#D1D5DB] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#479586]"
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
        </select>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2">
        <hr className="border-1 w-1/4 sm:w-1/3 border-black" />
        <p className="text-[#24243A] text-base sm:text-md font-mono px-2 sm:px-4  whitespace-nowrap">
          Player Setting
        </p>
        <hr className="border-1 w-1/4 sm:w-1/3 border-black" />
      </div>
      <div className="p-1 sm:p-2">
        <label className="block mb-1 text-xs sm:text-sm font-semibold">Player 1 Name</label>
        <input
          type="text"
          value={names[0]}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-white border-[#D1D5DB] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#479586] z-10"
          autoFocus
        />
      </div>
      {gameMode !== 'vsAI' && (
        <div className="p-1 sm:p-2">
          <label className="block mb-1 text-xs sm:text-sm font-semibold">Player 2 Name:</label>
          <input
            type="text"
            value={names[1]}
            onChange={(e) => setNames([names[0], e.target.value])}
            className="w-full p-2 sm:p-3 border-2 rounded-xl bg-white border-[#D1D5DB] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#479586] z-10"
          />
        </div>
      )}

    </div>
  );
});