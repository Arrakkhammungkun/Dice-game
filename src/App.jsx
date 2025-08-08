import React, { useState,useEffect } from 'react';
import './App.css'
import './custom.css'
import GameBoard from '../src/components/GameBoard'
import Navbar from './components/Navbar';
import History from './components/History';



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

  // โหลดประวัติจาก localStorage เมื่อเริ่ม
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
        } else {
          console.log('No gameHistory found in localStorage');
          setGameHistory([]);
        }
      } catch (e) {
        console.error('Failed to load gameHistory from localStorage:', e);
        setGameHistory([]);
      } finally {
        setIsLoaded(true); 
      }
    };

    loadHistory();

  
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  // บันทึกประวัติเมื่อ gameHistory เปลี่ยน
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } catch (e) {
      console.error('Failed to save gameHistory to localStorage:', e);
    }
  }, [gameHistory, isLoaded]);

  const newGame = () => {
  setScores([0, 0]);
  setCurrentScore(0);
  setCurrentPlayer(0);
  setGameOver(false);
  };

  const handleGameEnd = (gameData) => {
    setGameHistory((prev) => {
      const isDuplicate = prev.some(
        (game) =>
          game.id === gameData.id ||
          (game.timestamp === gameData.timestamp &&
           game.winner === gameData.winner &&
           JSON.stringify(game.scores) === JSON.stringify(gameData.scores))
      );
      if (isDuplicate) {
        return prev;
      }
      const updatedHistory = [gameData, ...prev];
      return updatedHistory;
    });
  };

  return (
    <div className='bg-plus-pattern min-h-screen w-full pt-14 sm:pt-20 lg:pt-28' >
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
      />
   
      <div className="container mx-auto p-4  ">
          {/* <nav className="mb-4">
            <button onClick={() => setView('game')} className="mr-2 p-2 bg-blue-500 text-white rounded">Game</button>
            <button onClick={() => setView('settings')} className="mr-2 p-2 bg-green-500 text-white rounded">Settings</button>
            <button onClick={() => setView('history')} className="p-2 bg-yellow-500 text-white rounded">History</button>
          </nav> */}
        
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
          />
          )}
         {view === 'history' && <History gameHistory={gameHistory} setGameHistory={setGameHistory} />}
      </div>  
     
    </div>
    
  );
}

export default App
