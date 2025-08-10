  import React, { useState, useEffect } from 'react';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faGear } from '@fortawesome/free-solid-svg-icons';
  import GameSettings from './setting/GameSettings';
  import CustomDiceSettings from './setting/CustomDiceSettings';
  const Settings = ({
    onClose,
    playerNames,
    setPlayerNames,
    targetScore,
    setTargetScore,
    gameMode,
    setGameMode,
    aiDifficulty,
    setAiDifficulty,
    tournamentConfig,
    setTournamentConfig,
  }) => {
    const [names, setNames] = useState(playerNames);
    const [target, setTarget] = useState(targetScore);
    const [view, setView] = useState('game');
    const [localGameMode, setLocalGameMode] = useState(gameMode || '2player');
    const [localAiDifficulty, setLocalAiDifficulty] = useState(aiDifficulty || 'easy');
    const [localTournamentConfig, setLocalTournamentConfig] = useState(
      tournamentConfig || { bestOf: 3, currentRound: 1 }
    );

    const [selectedDice, setSelectedDice] = useState(localStorage.getItem('selectedDice') || 'default');
    const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'classic');


    useEffect(() => {
      setNames(playerNames);
      setTarget(targetScore);
      setLocalGameMode(gameMode);
      setLocalAiDifficulty(aiDifficulty);
      setLocalTournamentConfig(tournamentConfig || { bestOf: 3, currentRound: 1 });
    }, [playerNames, targetScore, gameMode, aiDifficulty, tournamentConfig]);

    const handleSave = () => {

      setPlayerNames(names);
      setTargetScore(target);
      setGameMode(localGameMode);
      setAiDifficulty(localAiDifficulty);
      localStorage.setItem('selectedDice', selectedDice);
      localStorage.setItem('selectedTheme', selectedTheme);
      if (typeof setTournamentConfig === 'function') {
        setTournamentConfig({
          ...localTournamentConfig,
          currentRound: 1, // รีเซ็ต currentRound เมื่อบันทึก
        });
      } else {
        console.error('setTournamentConfig is not a function:', setTournamentConfig);
      }
      onClose();
    };

    const renderContent = () => {
      switch (view) {
        case 'game':
          return (
            <GameSettings
              names={names}
              setNames={setNames}
              target={target}
              setTarget={setTarget}
              gameMode={localGameMode}
              setGameMode={setLocalGameMode}
              aiDifficulty={localAiDifficulty}
              setAiDifficulty={setLocalAiDifficulty}
              tournamentConfig={localTournamentConfig}
              setTournamentConfig={setLocalTournamentConfig}
  
            />
          );
        case 'custom':
          return (<CustomDiceSettings
            selectedDice={selectedDice}
            setSelectedDice={setSelectedDice}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            />)
        case 'audio':
          return <div>Audio Settings (Not Implemented)</div>;
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-2 sm:pt-4 z-50 overflow-y-auto">
        <div className="bg-[#121417]/95 rounded-lg shadow-lg p-3 sm:p-4 flex flex-col items-center gap-3 w-full max-w-[90%] sm:max-w-3xl mx-auto my-4 sm:my-8">
          <h1 className="flex font-mono items-center gap-2 text-[#F5F2F4] w-fit px-3 py-1 sm:px-4 sm:py-2 rounded text-lg sm:text-xl">
            <FontAwesomeIcon icon={faGear} className="text-[#F5F2F4] text-base sm:text-xl" />
            SETTINGS
          </h1>
          <div className="w-full flex flex-col sm:flex-row font-mono">
            <div className="flex sm:flex-col gap-2 sm:w-1/4 sm:pr-4 sm:border-r sm:border-gray-300 justify-center sm:justify-start mb-3 sm:mb-0">
              <button
                onClick={() => setView('game')}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                  view === 'game' ? 'bg-[#479586]/90 text-[#fff]' : 'bg-[#1F2937]'
                } hover:bg-[#374151] text-[#F5F2F4] w-full sm:w-auto`}
              >
                Game
              </button>
              <button
                onClick={() => setView('custom')}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                  view === 'custom' ? 'bg-[#479586]/90 text-[#fff]' : 'bg-[#1F2937]'
                } hover:bg-[#374151] text-[#F5F2F4] w-full sm:w-auto`}
              >
                Custom
              </button>
              <button
                onClick={() => setView('audio')}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                  view === 'audio' ? 'bg-[#479586]/90 text-[#fff]' : 'bg-[#1F2937]'
                } hover:bg-[#374151] text-[#F5F2F4] w-full sm:w-auto`}
              >
                Audio
              </button>
            </div>
            <div className="w-full sm:w-3/4 sm:pl-4">
              {renderContent()}
              <div className="flex justify-end p-2 gap-2">
                <button
                  onClick={onClose}
                  className="p-2 px-4 sm:px-6 bg-[#D1D5DB] text-[#24243A] hover:bg-[#B2B8C1] rounded-md text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 px-4 sm:px-6 bg-[#4B8A65] text-white rounded hover:bg-[#5F9F7A] text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Settings;