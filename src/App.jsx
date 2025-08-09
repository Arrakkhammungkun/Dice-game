import React, { useState, useEffect } from 'react';
import './App.css';
import './custom.css';
import GameBoard from './components/GameBoard';
import Navbar from './components/Navbar';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';

function App() {
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [targetScore, setTargetScore] = useState(10);
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

  // โหลดประวัติจาก localStorage
  useEffect(() => {
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

  // บันทึกประวัติเมื่อ gameHistory เปลี่ยน
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
    localStorage.removeItem('tournamentWins');
    localStorage.removeItem('tournamentOver');
  };

  const handleGameEnd = (gameData) => {
    console.log('handleGameEnd called:', { gameData, tournamentWins, tournamentOver, bestOf: tournamentConfig.bestOf, gameMode });

    // ตรวจสอบ gameData
    if (!gameData.winner || !gameData.scores) {
      console.warn('Invalid gameData, skipping:', gameData);
      return;
    }

    // รีเซ็ต tournamentStartTime สำหรับรอบแรกของทัวร์นาเมนต์
    if (gameMode === 'tournament' && tournamentConfig.currentRound === 1) {
      console.log('Resetting tournamentStartTime for first round');
      setTournamentStartTime(Date.now());
    }

    // บันทึก gameData เฉพาะโหมด 2player และ vsAI
    if (gameMode !== 'tournament') {
      setGameHistory((prev) => {
        const isDuplicate = prev.some(
          (game) =>
            game.id === gameData.id ||
            (game.timestamp === gameData.timestamp &&
             game.winner === gameData.winner &&
             JSON.stringify(game.scores) === JSON.stringify(gameData.scores))
        );
        if (isDuplicate) return prev;
        return [gameData, ...prev];
      });
    }

    if (gameMode === 'tournament') {
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
    }
  };

  return (
    <div className="bg-plus-pattern min-h-screen w-full pt-14 sm:pt-20 lg:pt-28">
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
      />
      <div className="container mx-auto p-4">
        {/* {view === 'game' && gameMode === 'tournament' && (
          <TournamentBoard
            tournamentWins={tournamentWins}
            tournamentConfig={tournamentConfig}
            playerNames={playerNames}
            tournamentOver={tournamentOver}
          />
        )} */}

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
          />
        )}
        {view === 'history' && <History gameHistory={gameHistory} setGameHistory={setGameHistory} />}
        {view === 'leaderboard' && <Leaderboard gameHistory={gameHistory} />}
        {view === 'achievements' && <Achievements gameHistory={gameHistory} />}
      </div>
    </div>
  );
}

export default App;