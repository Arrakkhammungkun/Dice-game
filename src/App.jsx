import React, { useState, useEffect } from 'react';
import './App.css';
import './custom.css';
import GameBoard from './components/GameBoard';
import Navbar from './components/Navbar';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Help from './components/Help';
function App() {
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [targetScore, setTargetScore] = useState(100);
  const [view, setView] = useState('game');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameMode, setGameMode] = useState('2player');
  const [aiDifficulty, setAiDifficulty] = useState('easy');
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tournamentWins, setTournamentWins] = useState([0, 0]);
  const [tournamentConfig, setTournamentConfig] = useState({ bestOf: 3, currentRound: 1 });
  const [tournamentOver, setTournamentOver] = useState(false);
  const [tournamentStartTime, setTournamentStartTime] = useState(Date.now());
 
  // eslint-disable-next-line no-unused-vars
  const [gameKey, setGameKey] = useState(Date.now());
  const [timeLimit, setTimeLimit] = useState(60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [selectedDice, setSelectedDice] = useState(localStorage.getItem('selectedDice') || 'default');
  const [sounds, setSounds] = useState(() => ({
    rollSuccess: localStorage.getItem('soundRollSuccess') || 'success.mp3',
    bank: localStorage.getItem('soundBank') || 'success_bank.mp3',
    fail: localStorage.getItem('soundFail') || 'fail.mp3',
    win: localStorage.getItem('soundWin') || 'win.mp3',
    roundWin: localStorage.getItem('soundRoundWin') || 'round_win.mp3',
  }));

  useEffect(() => { 
    const applyTheme = () => {
        let theme = localStorage.getItem("selectedTheme");
        if (!theme) {
          theme = "dark"; 
        }
        if (theme === "system") {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          theme = prefersDark ? "dark" : "light";
        }
        document.documentElement.setAttribute("data-theme", theme);
      };
    applyTheme(); 

  
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (localStorage.getItem("selectedTheme") === "system" || !localStorage.getItem("selectedTheme")) {
        applyTheme();
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);;
    
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('gameHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setGameHistory(parsedHistory);
          } else {
            console.error('Invalid gameHistory format in localStorage:', parsedHistory);
            setGameHistory([]);
          }
        }
      } catch (e) {
        console.error('Failed to load gameHistory from localStorage:', e);
        setGameHistory([]);
      }
    };

    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('tournamentConfig');
        if (savedConfig) {
          setTournamentConfig(JSON.parse(savedConfig));
        }
      } catch (e) {
        console.error('Failed to load tournamentConfig:', e);
      }
    };

    const loadWins = () => {
      try {
        const savedWins = localStorage.getItem('tournamentWins');
        if (savedWins) {
          setTournamentWins(JSON.parse(savedWins));
        }
      } catch (e) {
        console.error('Failed to load tournamentWins:', e);
      }
    };

    const loadTournamentOver = () => {
      try {
        const savedOver = localStorage.getItem('tournamentOver');
        if (savedOver) {
          setTournamentOver(JSON.parse(savedOver));
        }
      } catch (e) {
        console.error('Failed to load tournamentOver:', e);
      }
    };

    loadHistory();
    loadConfig();
    loadWins();
    loadTournamentOver();
    setIsLoaded(true);

    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } catch (e) {
      console.error('Failed to save gameHistory to localStorage:', e);
    }
  }, [gameHistory, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tournamentConfig', JSON.stringify(tournamentConfig));
    } catch (e) {
      console.error('Failed to save tournamentConfig to localStorage:', e);
    }
  }, [tournamentConfig, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tournamentWins', JSON.stringify(tournamentWins));
    } catch (e) {
      console.error('Failed to save tournamentWins to localStorage:', e);
    }
  }, [tournamentWins, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tournamentOver', JSON.stringify(tournamentOver));
    } catch (e) {
      console.error('Failed to save tournamentOver to localStorage:', e);
    }
  }, [tournamentOver, isLoaded]);

  const newGame = () => {
    console.log('newGame called, resetting:', { tournamentOver, tournamentWins, currentRound: tournamentConfig.currentRound });
    setScores([0, 0]);
    setCurrentScore(0);
    setCurrentPlayer(0);
    setGameOver(false);
    setTournamentWins([0, 0]);
    setTournamentConfig((prev) => ({ ...prev, currentRound: 1 }));
    setTournamentOver(false);
    setGameKey(Date.now());
    setTournamentStartTime(Date.now());
    setTimerStarted(false);
    localStorage.removeItem('tournamentWins');
    localStorage.removeItem('tournamentOver');
  };

  const handleGameEnd = (gameData) => {

    if (!gameData.winner || !gameData.scores) {
      console.warn('Invalid gameData, skipping:', gameData);
      return;
    }

    setGameHistory((prev) => {
      const isDuplicate = prev.some(
        (game) =>
          game.id === gameData.id ||
          (game.timestamp === gameData.timestamp &&
           (game.winner === gameData.winner || game.tournamentWinner === gameData.tournamentWinner) &&
           JSON.stringify(game.scores || game.tournamentWins) === JSON.stringify(gameData.scores || gameData.tournamentWins))
      );
      if (isDuplicate) return prev;
      return [gameData, ...prev];
    });

    if (gameMode === 'tournament') {
      if (tournamentConfig.currentRound === 1) {
    
        setTournamentStartTime(Date.now());
      }

      const winnerIndex = gameData.winner === playerNames[0] ? 0 : 1;
      const newWins = [...tournamentWins];
      newWins[winnerIndex]++;
      setTournamentWins(newWins);

      const requiredWins = Math.ceil(tournamentConfig.bestOf / 2);
      console.log('Checking tournament end:', { newWins, requiredWins, bestOf: tournamentConfig.bestOf });
      if (newWins[0] >= requiredWins || newWins[1] >= requiredWins) {
        setTournamentOver(true);
        const tournamentData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tournamentWinner: newWins[0] > newWins[1] ? playerNames[0] : playerNames[1] || 'Unknown Player',
          tournamentWins: newWins.length ? newWins : [0, 0],
          duration: Math.floor((Date.now() - tournamentStartTime) / 1000),
          timestamp: new Date().toISOString(),
          gameMode: gameMode || 'tournament',
          playerNames: playerNames.length ? playerNames : ['Player 1', 'Player 2'],
          bestOf: tournamentConfig?.bestOf || 3,
          rollOnesCount: gameData.rollOnesCount || 0,
          consecutiveOnes: gameData.consecutiveOnes || [0, 0],
        };
        console.log('Tournament end, saving tournamentData:', tournamentData);
        setGameHistory((prev) => {
          const isDuplicate = prev.some(
            (game) =>
              game.id === tournamentData.id ||
              (game.timestamp === tournamentData.timestamp &&
               game.tournamentWinner === tournamentData.tournamentWinner &&
               JSON.stringify(game.tournamentWins) === JSON.stringify(tournamentData.tournamentWins))
          );
          if (isDuplicate) return prev;
          return [tournamentData, ...prev];
        });
      } else {
        setTournamentConfig((prev) => ({
          ...prev,
          currentRound: prev.currentRound + 1,
        }));
        setTournamentOver(false);
      }
    } else if (gameMode === 'timed') {
      const winner = gameData.scores[0] > gameData.scores[1] ? playerNames[0] : gameData.scores[1] > gameData.scores[0] ? playerNames[1] : 'Draw';
      const timedGameData = {
        ...gameData,
        gameMode: 'timed',
        timeLimit,
        winner,
      };
      setGameHistory((prev) => {
        const isDuplicate = prev.some(
          (game) =>
            game.id === timedGameData.id ||
            (game.timestamp === timedGameData.timestamp &&
             game.winner === timedGameData.winner &&
             JSON.stringify(game.scores) === JSON.stringify(timedGameData.scores))
        );
        if (isDuplicate) return prev;
        return [timedGameData, ...prev];
      });
      setGameOver(true);
      setTimerStarted(false);
    }
  };

  return (
      <div className="bg-plus-pattern min-h-screen w-full pt-14 sm:pt-20 lg:pt-28 light:bg-white dark:bg-[#24243A] colorful:bg-[#ECE3CA]">      
      <Navbar
        NewGame={newGame}
        playerNames={playerNames}
        setPlayerNames={setPlayerNames}
        targetScore={targetScore}
        setTargetScore={setTargetScore}
        gameMode={gameMode}
        setGameMode={setGameMode}
        aiDifficulty={aiDifficulty}
        setAiDifficulty={setAiDifficulty}
        setView={setView}
        tournamentConfig={tournamentConfig}
        setTournamentConfig={setTournamentConfig}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        selectedDice={selectedDice} 
        setSelectedDice={setSelectedDice}
        sounds={sounds}
        setSounds={setSounds}
      />
      <div className="container mx-auto p-4">
        {view === 'game' && (
          <GameBoard
            playerNames={playerNames}
            targetScore={targetScore}
            scores={scores}
            setScores={setScores}
            currentScore={currentScore}
            setCurrentScore={setCurrentScore}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            gameOver={gameOver}
            setGameOver={setGameOver}
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
            onGameEnd={handleGameEnd}
            tournamentConfig={tournamentConfig}
            tournamentWins={tournamentWins}
            tournamentOver={tournamentOver}
            newGame={newGame}
            timeLimit={timeLimit}
            timerStarted={timerStarted}
            setTimerStarted={setTimerStarted}
            selectedDice={selectedDice}
            sounds={sounds}
          />
        )}
        {view === 'history' && <History gameHistory={gameHistory} setGameHistory={setGameHistory} />}
        {view === 'leaderboard' && <Leaderboard gameHistory={gameHistory} />}
        {view === 'achievements' && <Achievements gameHistory={gameHistory} />}
        {view === 'help'  && <Help setView={setView} />}
      </div>
    </div>
  );
}

export default App;