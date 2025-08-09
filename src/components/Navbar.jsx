import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from './ConfirmModal';
import Settings from './Settings';

const Navbar = ({
  NewGame,
  playerNames,
  setPlayerNames,
  targetScore,
  setTargetScore,
  gameMode,
  setGameMode,
  aiDifficulty,
  setAiDifficulty,
  setView,
  tournamentConfig,
  setTournamentConfig,

}) => {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNewGameClick = () => {
    setShowModal(true);
   
  };
  

  const confirmNewGame = () => {
    setShowModal(false);
    setIsMenuOpen(false)
    NewGame();
    setView('game')
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setIsMenuOpen(false); 
  };

  const cancelNewGame = () => {
    setShowModal(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleHistoryClick = () => {
    setView('history');
    setIsMenuOpen(false);
  };
  const handlePlayClick = () => {
    setView('game');
    setIsMenuOpen(false);
  };
  const handleLeaderboardClick = () => {
    setView('leaderboard');
    setIsMenuOpen(false);
  };
  const handleAchievementsdClick = () => {
    setView('achievements');
    setIsMenuOpen(false);
  };
  return (
    <nav className="bg-[#141424] p-3 sm:p-4 w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-2 sm:px-4  lg:max-w-8xl mx-auto">
       
        <div className="text-white text-xl sm:text-3xl font-bold">Dict Game</div>

        {/* Hamburger Icon  */}
        <button
          className="sm:hidden text-white text-xl focus:outline-none"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        {/* ปุ่มสำหรับเดสก์ท็อป */}
        <div className="hidden sm:flex items-center space-x-3 sm:space-x-4 ">
          <button
            onClick={handlePlayClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            Play
          </button>
          <button
            onClick={handleLeaderboardClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            Leaderboard
          </button>
          <button
            onClick={handleAchievementsdClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            Achievements
          </button>
          <button
            onClick={handleHistoryClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            History
          </button>
          <button
            onClick={handleSettingsClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            Settings
          </button>
          <button
            onClick={handleNewGameClick}
            className="bg-[#F5F2F4] text-black font-bold px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-[#b4b2b3] text-sm sm:text-base"
          >
            New Game
          </button>
        </div>
      </div>

      {/* เมนูสำหรับมือถือ  */}
      {isMenuOpen && (
        <div className="sm:hidden flex flex-col items-center bg-[#141424] p-4 space-y-3  mt-2">
          <button
            onClick={handlePlayClick}
            className="text-gray-300 hover:text-white font-bold w-full text-center py-2 text-sm"
          >
            Play
          </button>

          <button
            onClick={handleSettingsClick}
            className="text-gray-300 hover:text-white font-bold w-full text-center py-2 text-sm"
          >
            Settings
          </button>
          <button
            onClick={handleLeaderboardClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            Leaderboard
          </button>
          <button
            onClick={handleAchievementsdClick}
            className="text-gray-300 hover:text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base"
          >
            Achievements
          </button>

          <button
            onClick={handleHistoryClick}
            className="text-gray-300 hover:text-white font-bold w-full text-center py-2 text-sm"
          >
            History
          </button>
          <button
            onClick={handleNewGameClick}
            className="bg-[#F5F2F4] text-black font-bold w-full py-2 rounded hover:bg-[#b4b2b3] text-sm"
          >
            New Game
          </button>
        </div>
      )}

 
      <ConfirmModal
        isOpen={showModal}
        onConfirm={confirmNewGame}
        onCancel={cancelNewGame}
       
      />

   
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          targetScore={targetScore}
          setTargetScore={setTargetScore}
          gameMode={gameMode}
          setGameMode={setGameMode}
          aiDifficulty={aiDifficulty}
          setAiDifficulty={setAiDifficulty}
          tournamentConfig={tournamentConfig}
          setTournamentConfig={setTournamentConfig}
        />
      )}
    </nav>
  );
};

export default Navbar;