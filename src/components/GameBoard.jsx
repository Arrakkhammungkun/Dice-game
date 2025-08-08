import React, { useState, useEffect } from 'react';
import Dice from './Dict';
import Scoreboard from './Scoreboard';
import WinnerModal from './WinnerModel';

const audio_success = new Audio('sounds/success.mp3');
const audio_success_bank = new Audio('sounds/success_bank.mp3');
const audio_fail = new Audio('sounds/fail.mp3');
const audio_win = new Audio('sounds/win.mp3');

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
}) {
  const [isRolling, setIsRolling] = useState(false);
  const [aiRolling, setAiRolling] = useState(false);
  const [aiTurnActive, setAiTurnActive] = useState(false);
  const [nextRoll, setNextRoll] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const [hasEnded, setHasEnded] = useState(false);
  const [rollOnesCount, setRollOnesCount] = useState(0)

  const isAiTurn = gameMode === 'vsAI' && currentPlayer === 1 && !gameOver;

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
  }, [isAiTurn, aiRolling, isRolling, aiTurnActive, nextRoll]);

  useEffect(() => {
    if (isAiTurn && !isRolling && currentScore > 0) {
      checkAiStrategy(lastRoll);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore, isAiTurn, isRolling, lastRoll]);

  const aiTurn = () => {
    setAiRolling(true);
    setIsRolling(true);
  };

  const handleAiRollComplete = (roll) => {
    setAiRolling(false);
    setIsRolling(false);
    setLastRoll(roll);

    if (roll === 1) {
      try {
        audio_fail.play();
      } catch (e) {
        console.log('Audio play failed:', e);
      }
      setCurrentScore(0);
      setAiTurnActive(false);
      setNextRoll(false);
      setRollOnesCount((prev) => prev + 1);
      if (!gameOver) setCurrentPlayer(0);
    } else {
      try {
        audio_success.currentTime = 0;
        audio_success.play();
      } catch (e) {
        console.log('Audio play failed:', e);
      }
      setCurrentScore((prev) => prev + roll);
      checkAiStrategy(roll);
    }
  };

  const checkAiStrategy = (roll) => {

    if (!isAiTurn || aiRolling) return;

    if (aiDifficulty === 'easy') {
      if (Math.random() > 0.8 && currentScore > 0) {
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
      } else {
        try {
          audio_success.currentTime = 0;
          audio_success.play();
        } catch (e) {
          console.log('Audio play failed:', e);
        }
        setCurrentScore((prev) => prev + roll);
      }
    }
  };

  const holdScore = () => {
    if (hasEnded) {
      return;
    }

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
      try {
        audio_win.play();
      } catch (e) {
        console.log('Audio play failed:', e);
      }
      setGameOver(true);
      setHasEnded(true);
      const winner = newScores[0] >= targetScore ? playerNames[0] : playerNames[1] || 'Unknown Player';
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const gameData = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        winner,
        scores: newScores,
        duration,
        timestamp: new Date().toISOString(),
        gameMode,
        aiDifficulty: gameMode === 'vsAI' ? aiDifficulty : null,
        rollOnesCount,
        playerNames: gameMode === 'vsAI' ? [playerNames[0], `AI (${aiDifficulty})`] : playerNames,
      };
      onGameEnd(gameData);
    }

    setCurrentScore(0);
    setAiRolling(false);
    setAiTurnActive(false);
    setNextRoll(false);

    if (!gameOver && newTotalScore < targetScore) {
      setCurrentPlayer((prev) => (prev + 1) % 2);
    }
  };

  return (
    <div className="p-2 sm:p-4  rounded-lg  max-w-3xl mx-auto my-4 sm:my-8">
      {gameOver && (
        <WinnerModal
          winner={scores[0] >= targetScore ? playerNames[0] : playerNames[1] || 'Unknown Player'}
          winnerScore={scores[0] >= targetScore ? scores[0] : scores[1] || 0}
          scores={scores}
          onClose={() => {
            setScores([0, 0]);
            setCurrentScore(0);
            setCurrentPlayer(0);
            setGameOver(false);
            setHasEnded(false);
            setStartTime(Date.now());

            setRollOnesCount(0)
          }}
        />
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
      />

    </div>
  );
}

export default GameBoard;