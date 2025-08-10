import React, { useState, useEffect } from 'react';
import Dice from './Dice/Dict';
import Scoreboard from './Scoreboard';
import WinnerModal from './Model/WinnerModel';
import RoundWinnerModal from './Model/RoundWinnerModal';


function GameBoard({
  playerNames,
  targetScore,
  scores,
  setScores,
  currentScore,
  setCurrentScore,
  currentPlayer,
  setCurrentPlayer,
  gameOver,
  setGameOver,
  gameMode,
  aiDifficulty,
  onGameEnd,
  tournamentConfig,
  tournamentWins,
  tournamentOver,
  newGame,
  // timeLimit,
  selectedDice,
  sounds,
}) {
  const [isRolling, setIsRolling] = useState(false)
  const [aiRolling, setAiRolling] = useState(false)
  const [aiTurnActive, setAiTurnActive] = useState(false)
  const [nextRoll, setNextRoll] = useState(false)
  const [lastRoll, setLastRoll] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [hasEnded, setHasEnded] = useState(false)
  const [rollOnesCount, setRollOnesCount] = useState(0)
  const [roundWinner, setRoundWinner] = useState(null);
  const [consecutiveOnes, setConsecutiveOnes] = useState([0, 0])
  const isAiTurn = gameMode === 'vsAI' && currentPlayer === 1 && !gameOver



  
const audio_success = new Audio(`sounds/${sounds.rollSuccess}`);
const audio_success_bank = new Audio(`sounds/${sounds.bank}`);
const audio_fail = new Audio(`sounds/${sounds.fail}`);
const audio_win = new Audio(`sounds/${sounds.win}`);
const audio_round_win = new Audio(`sounds/${sounds.roundWin}`);

audio_win.onerror = () => console.error('Failed to load win.mp3');
audio_round_win.onerror = () => console.error('Failed to load round_win.mp3');


  // รีเซ็ต hasEnded 
  useEffect(() => {
    if (!gameOver || tournamentOver) {
      setHasEnded(false);
      setConsecutiveOnes([0, 0])
    }
  }, [gameOver, tournamentOver]);

  
  useEffect(() => {
    if (gameMode === 'tournament' && tournamentOver) {
      try {
        audio_win.play();
      } catch (e) {
        console.log('Audio play failed for win.mp3:', e)
      }
    }
  }, [tournamentOver, gameMode])

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (isAiTurn && !aiRolling && !isRolling && !aiTurnActive) {
      setAiTurnActive(true);
      setTimeout(() => aiTurn(), 1000);
    } else if (isAiTurn && !aiRolling && !isRolling && nextRoll) {
      setTimeout(() => {
        setNextRoll(false);
        aiTurn();
      }, 1000);
    }
  }, [isAiTurn, aiRolling, isRolling, aiTurnActive, nextRoll])

  useEffect(() => {
    if (isAiTurn && !isRolling && currentScore > 0) {
      checkAiStrategy(lastRoll)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore, isAiTurn, isRolling, lastRoll])

  const aiTurn = () => {
    setAiRolling(true)
    setIsRolling(true)
  };

  const handleAiRollComplete = (roll) => {
    setAiRolling(false)
    setIsRolling(false)
    setLastRoll(roll)

    if (roll === 1) {
      try {
        audio_fail.play()
      } catch (e) {
        console.log('Audio play failed:', e)
      }
      setCurrentScore(0);
      setAiTurnActive(false)
      setNextRoll(false)
      setRollOnesCount((prev) => prev + 1)
      setConsecutiveOnes((prev) => {
        const newConsecutive = [...prev]
        newConsecutive[1] += 1
        newConsecutive[0] = 0
        return newConsecutive
      })

      if (!gameOver) setCurrentPlayer(0)
    } else {
      try {
        audio_success.currentTime = 0
        audio_success.play()
      } catch (e) {
        console.log('Audio play failed:', e)
      }
      setCurrentScore((prev) => prev + roll)
      setConsecutiveOnes((prev) => {
        const newConsecutive = [...prev]
        newConsecutive[1] = 0
        return newConsecutive
      });
      checkAiStrategy(roll);
    }
  };

  const checkAiStrategy = (roll) => {
    if (!isAiTurn || aiRolling) return;

    if (aiDifficulty === 'easy') {
      if (Math.random() > 0.6 && currentScore > 0) {
        setTimeout(holdScore, 1000);
      } else if (currentScore > 0 && roll !== 1) {
        setNextRoll(true);
      }
    } else if (aiDifficulty === 'medium') {
      if (currentScore >= 25) {
        setTimeout(holdScore, 1000);
      } else if (currentScore > 0 && roll !== 1) {
        setNextRoll(true);
      }
    } else if (aiDifficulty === 'hard') {
      const opponentScore = scores[0];
      const aiTotalScore = scores[1] + currentScore;
      const remaining = targetScore - aiTotalScore;
      if (
        currentScore >= 8 ||
        (remaining <= 20 && currentScore > 0) ||
        aiTotalScore < opponentScore + 10
      ) {
        setTimeout(holdScore, 1000);
      } else if (currentScore > 0 && roll !== 1) {
        setNextRoll(true);
      }
    }

    if (currentScore === 0 || roll === 1) {
      setAiRolling(false);
      setAiTurnActive(false);
      setNextRoll(false);
      if (roll === 1 && !gameOver) {
        setCurrentPlayer(0);
      }
    }
  };

  const rollDice = (roll) => {
    if (isAiTurn) {
      handleAiRollComplete(roll);
    } else {
      setIsRolling(false);
      if (roll === 1) {
        try {
          audio_fail.play();
        } catch (e) {
          console.log('Audio play failed:', e);
        }
        setCurrentScore(0);
        setCurrentPlayer((prev) => (prev + 1) % 2);
        setRollOnesCount((prev) => prev + 1);
        setConsecutiveOnes((prev) => {
          const newConsecutive = [...prev];
          newConsecutive[currentPlayer] += 1; 
          newConsecutive[(currentPlayer + 1) % 2] = 0; 
          return newConsecutive;
        });
      } else {
        try {
          audio_success.currentTime = 0;
          audio_success.play();
        } catch (e) {
          console.log('Audio play failed:', e);
        }
        setCurrentScore((prev) => prev + roll)
        setConsecutiveOnes((prev) => {
          const newConsecutive = [...prev];
          newConsecutive[currentPlayer] = 0
          return newConsecutive;
        });
      }
    }
  };

  const holdScore = () => {
    if (hasEnded) return;

    const newTotalScore = scores[currentPlayer] + currentScore;
    const newScores = [...scores];
    newScores[currentPlayer] = newTotalScore;

    setScores(newScores);

    try {
      audio_success_bank.play();
    } catch (e) {
      console.log('Audio play failed:', e);
    }

    if (newTotalScore >= targetScore && !hasEnded) {
      const winner = newScores[0] >= targetScore ? playerNames[0] : playerNames[1] || 'Unknown Player';
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const gameData = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        winner,
        scores: newScores.length ? newScores : [0, 0],
        duration,
        timestamp: new Date().toISOString(),
        gameMode,
        aiDifficulty: gameMode === 'vsAI' ? aiDifficulty : null,
        rollOnesCount,
        playerNames: gameMode === 'vsAI' ? [playerNames[0], `AI (${aiDifficulty})`] : playerNames,
        tournamentRound: gameMode === 'tournament' ? tournamentConfig?.currentRound : undefined,
        bestOf: gameMode === 'tournament' ? tournamentConfig?.bestOf : undefined, 
        consecutiveOnes,
      };



      if (gameMode === 'tournament') {
        try {
          audio_round_win.play();
        } catch (e) {
          console.log('Audio play failed:', e);
        }
        setRoundWinner(winner);
        onGameEnd(gameData);
        setHasEnded(true);
      } else {
        try {
          audio_win.play();
        } catch (e) {
          console.log('Audio play failed:', e);
        }
        setGameOver(true);
        setHasEnded(true);
        onGameEnd(gameData);
      }
    }

    setCurrentScore(0);
    setAiRolling(false);
    setAiTurnActive(false);
    setNextRoll(false);

    if (!gameOver && newTotalScore < targetScore) {
      setCurrentPlayer((prev) => (prev + 1) % 2);
    }
  };

  const handleRoundClose = () => {
    
    setScores([0, 0])
    setCurrentScore(0)
    setCurrentPlayer(0)
    setGameOver(false)
    setHasEnded(false)
    setStartTime(Date.now())
    setRollOnesCount(0)
    setRoundWinner(null)
     setConsecutiveOnes([0, 0])
  };

  return (
    <div className="p-2 sm:p-4 rounded-lg max-w-3xl mx-auto my-4 sm:my-8">
      {gameMode === 'tournament' && !tournamentOver && roundWinner && (
        <RoundWinnerModal
          roundWinner={roundWinner}
          roundNumber={tournamentConfig?.currentRound || 1}
          onClose={handleRoundClose}
        />
      )}
      {gameMode === 'tournament' && tournamentOver && (
        <WinnerModal
          winner={tournamentWins[0] > tournamentWins[1] ? playerNames[0] : playerNames[1]}
          winnerScore={tournamentWins[0] > tournamentWins[1] ? tournamentWins[0] : tournamentWins[1]}
          scores={tournamentWins}
          onClose={() => {
            console.log('WinnerModal closed, calling newGame');
            setRoundWinner(null);
            newGame();
          }}
          gameMode={gameMode}
          tournamentOver={tournamentOver}
        />
      )}
      {gameMode !== 'tournament' && gameOver && (
        <WinnerModal
          winner={scores[0] >= targetScore ? playerNames[0] : playerNames[1] || 'Unknown Player'}
          winnerScore={scores[0] >= targetScore ? scores[0] : scores[1] || 0}
          scores={scores}
          onClose={() => {
            newGame();
          }}
          gameMode={gameMode}
          tournamentOver={tournamentOver}
        />
      )}
      {gameMode === 'tournament' && (
        <div className="p-4 bg-[#1C2126] rounded-lg shadow-md mb-4 text-center">
          <h2 className="text-xl font-mono text-[#F5F2F4] mb-2">Tournament (Best of {tournamentConfig?.bestOf || 3})</h2>
          <p className="text-[#F5F2F4]">Round: {tournamentConfig?.currentRound || 1}</p>
          <div className="flex justify-center gap-4">
            <div>
              <p className="text-[#E1A6E4] font-bold">{playerNames[0]}: {tournamentWins[0]} wins</p>
            </div>
            <div>
              <p className="text-[#83FFE7] font-bold">{playerNames[1]}: {tournamentWins[1]} wins</p>
            </div>
          </div>
        </div>
      )}
      <Scoreboard
        scores={scores}
        currentScore={currentScore}
        playerNames={playerNames}
        currentPlayer={currentPlayer}
      />
      <Dice
        rollDice={rollDice}
        holdScore={holdScore}
        isAiTurn={isAiTurn}
        isRolling={isRolling}
        setIsRolling={setIsRolling}
        selectedDice={selectedDice}
      />
    </div>
  );
}

export default GameBoard;