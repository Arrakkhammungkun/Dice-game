import React, { useState, useEffect, useRef } from 'react';
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
  timeLimit,
  timerStarted,
  setTimerStarted,
  startTimer,
  selectedDice,
  sounds,
}) {
  const [isRolling, setIsRolling] = useState(false);
  const [aiRolling, setAiRolling] = useState(false);
  const [aiTurnActive, setAiTurnActive] = useState(false);
  const [nextRoll, setNextRoll] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [hasEnded, setHasEnded] = useState(false);
  const [rollOnesCount, setRollOnesCount] = useState(0);
  const [roundWinner, setRoundWinner] = useState(null);
  const [consecutiveOnes, setConsecutiveOnes] = useState([0, 0]);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const isAiTurn = gameMode === 'vsAI' && currentPlayer === 1 && !gameOver;
  const isRollingRef = useRef(isRolling);

  const audio_bonus = new Audio('sounds/Bonus.mp3');
  const audio_success = new Audio(`sounds/${sounds.rollSuccess}`);
  const audio_success_bank = new Audio(`sounds/${sounds.bank}`);
  const audio_fail = new Audio(`sounds/${sounds.fail}`);
  const audio_win = new Audio(`sounds/${sounds.win}`);
  const audio_round_win = new Audio(`sounds/${sounds.roundWin}`);

  // จัดการข้อผิดพลาดเมื่อโหลดไฟล์เสียง
  audio_win.onerror = () => console.error('Failed to load win.mp3');
  audio_round_win.onerror = () => console.error('Failed to load round_win.mp3');
  audio_bonus.onerror = () => console.error('Failed to load Bonus.mp3');
    // อัปเดต isRollingRef เมื่อ isRolling เปลี่ยน เพื่อใช้ใน aiTurn และป้องกันการทอยซ้ำ
  useEffect(() => {
    isRollingRef.current = isRolling;
  }, [isRolling]);

    // รีเซ็ตสถานะเมื่อเกมจบหรือเริ่มใหม่
  useEffect(() => {
    if (!gameOver || tournamentOver) {
      setHasEnded(false);
      setConsecutiveOnes([0, 0]);
      setBonusTriggered(false);
      if (gameMode === 'timed') {
        setTimeRemaining(timeLimit);
      }
    }
  }, [gameOver, tournamentOver, gameMode, timeLimit]);

  // จัดการสถานะโบนัส
  useEffect(() => {
    if (bonusTriggered) {
      const timer = setTimeout(() => {
        setBonusTriggered(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bonusTriggered]);

  // เล่นเสียงชนะเมื่อ tournament จบ
  useEffect(() => {
    if (gameMode === 'tournament' && tournamentOver) {
      try {
        audio_win.play();
      } catch (e) {
        console.log('Audio play failed for win.mp3:', e);
      }
    }
  }, [tournamentOver, gameMode]);

  // ตั้งค่าเวลาเริ่มต้นเมื่อ component เริ่มทำงาน
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

 // จัดการตัวจับเวลาในโหมด timed
  useEffect(() => {
    if (gameMode === 'timed' && timerStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            const winner = scores[0] > scores[1] ? playerNames[0] : scores[1] > scores[0] ? playerNames[1] : 'Draw';
            const duration = Math.floor((Date.now() - startTime) / 1000);
            const gameData = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              winner,
              scores: [...scores],
              duration,
              timestamp: new Date().toISOString(),
              gameMode: 'timed',
              timeLimit,
              playerNames: [...playerNames],
              rollOnesCount,
              consecutiveOnes,
            };
            audio_win.play();
            setGameOver(true);
            setTimerStarted(false);
            setHasEnded(true);
            setIsRolling(false); 
            onGameEnd(gameData);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerStarted, gameMode, timeLimit, gameOver, scores, playerNames, startTime, rollOnesCount, consecutiveOnes, onGameEnd, setGameOver, setTimerStarted]);


   // จัดการตาของ AI ในโหมด vsAI
  useEffect(() => {
    if (isAiTurn && !aiRolling && !isRolling && !aiTurnActive && !gameOver && !hasEnded) {
      setAiTurnActive(true);
      setTimeout(() => aiTurn(), 1000);
    } else if (isAiTurn && !aiRolling && !isRolling && nextRoll && !gameOver && !hasEnded) {
      setTimeout(() => {
        setNextRoll(false);
        aiTurn();
      }, 1000);
    }
  }, [isAiTurn, aiRolling, isRolling, aiTurnActive, nextRoll, gameOver, hasEnded]);

  // ตรวจสอบกลยุทธ์ AI หลังการทอย
  useEffect(() => {
    if (isAiTurn && !isRolling && currentScore > 0) {
      checkAiStrategy(lastRoll);
    }
  }, [currentScore, isAiTurn, isRolling, lastRoll]);


  // ฟังก์ชัน aiTurn: เริ่มตาการทอยของ AI ในโหมด vsAI
  const aiTurn = () => {
    if (!gameOver && !hasEnded && !isRollingRef.current) {
      setAiRolling(true);
      setIsRolling(true);
    }
  };

  // ฟังก์ชัน handleAiRollComplete: จัดการผลการทอยของ AI
  const handleAiRollComplete = (roll) => {
    setAiRolling(false);
    setIsRolling(false);
    setLastRoll(roll);
    console.log('AI rolled:', roll);

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
      setConsecutiveOnes((prev) => {
        const newConsecutive = [...prev];
        newConsecutive[1] += 1;
        newConsecutive[0] = 0;
        return newConsecutive;
      });
      setBonusTriggered(false);
      if (!gameOver) setCurrentPlayer(0);
    } else {
      try {
        audio_success.currentTime = 0;
        audio_success.play();
      } catch (e) {
        console.log('Audio play failed:', e);
      }
      let scoreToAdd = roll;
      if (roll === 6) {
        scoreToAdd += 1;
        setBonusTriggered(true);
        console.log('AI Bonus triggered: +1 for rolling 6');
        try {
          audio_bonus.play();
        } catch (e) {
          console.log('Audio play failed for bonus:', e);
        }
      } else {
        setBonusTriggered(false);
      }
      setCurrentScore((prev) => {
        console.log('AI Current score:', prev + scoreToAdd);
        return prev + scoreToAdd;
      });
      setConsecutiveOnes((prev) => {
        const newConsecutive = [...prev];
        newConsecutive[1] = 0;
        return newConsecutive;
      });
      checkAiStrategy(roll);
    }
  };

  // ฟังก์ชันตัดสินใจ AI
  const checkAiStrategy = (roll) => {
    if (!isAiTurn || aiRolling || gameOver || hasEnded) return;

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

   // ฟังก์ชัน rollDice: จัดการผลการทอยลูกเต๋าสำหรับผู้เล่นและ AI
  const rollDice = (roll) => {
    if (isAiTurn) {
      handleAiRollComplete(roll);
    } else {
      setIsRolling(false);
      console.log('Player rolled:', roll);
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
        setBonusTriggered(false);
      } else {
        try {
          audio_success.currentTime = 0;
          audio_success.play();
        } catch (e) {
          console.log('Audio play failed:', e);
        }
        let scoreToAdd = roll;
        if (roll === 6) {
          scoreToAdd += 1;
          setBonusTriggered(true);
          console.log('Player Bonus triggered: +1 for rolling 6');
          try {
            audio_bonus.play();
          } catch (e) {
            console.log('Audio play failed for bonus:', e);
          }
        } else {
          setBonusTriggered(false);
        }
        setCurrentScore((prev) => {
          console.log('Player Current score:', prev + scoreToAdd);
          return prev + scoreToAdd;
        });
        setConsecutiveOnes((prev) => {
          const newConsecutive = [...prev];
          newConsecutive[currentPlayer] = 0;
          return newConsecutive;
        });
      }
    }
  };

  // ฟังก์ชัน holdScore: เก็บคะแนนชั่วคราวและตรวจสอบผู้ชนะ
  const holdScore = () => {
    if (hasEnded) return;

    const newTotalScore = scores[currentPlayer] + currentScore;
    const newScores = [...scores];
    newScores[currentPlayer] = newTotalScore;

    setScores(newScores);
    console.log('Holding score:', newTotalScore, 'for player:', currentPlayer);

    try {
      audio_success_bank.play();
    } catch (e) {
      console.log('Audio play failed:', e);
    }
    // ตรวจสอบว่ามีผู้ชนะหรือไม่ 
    if (newTotalScore >= targetScore && !hasEnded && gameMode !== 'timed') {
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
    setBonusTriggered(false);

    if (!gameOver && (gameMode !== 'timed' || newTotalScore < targetScore)) {
      setCurrentPlayer((prev) => (prev + 1) % 2);
    }
  };

  // ฟังก์ชันรีเซ็ตสถานะสำหรับรอบใหม่ในโหมด tournament
  const handleRoundClose = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setCurrentPlayer(0);
    setGameOver(false);
    setHasEnded(false);
    setStartTime(Date.now());
    setRollOnesCount(0);
    setRoundWinner(null);
    setConsecutiveOnes([0, 0]);
    setBonusTriggered(false);
    setTimeRemaining(timeLimit);
    setIsRolling(false);
  };

  return (
    <div className="p-2 sm:p-4 rounded-lg max-w-3xl mx-auto my-4 sm:my-8">
      {gameMode === 'timed' && !timerStarted && !gameOver && (
        <div className="p-4 bg-[#1C2126] rounded-lg shadow-md mb-4 text-center">
          <button
            onClick={() => {
              startTimer();
              setTimeRemaining(timeLimit);
              setIsRolling(false); 
            }}
            className="bg-[#E1A6E4] text-[#1C2126] font-bold py-2 px-4 rounded hover:bg-[#83FFE7] transition"
          >
            Start Timed Game
          </button>
        </div>
      )}
      {gameMode === 'timed' && timerStarted && !gameOver && (
        <div className="p-4 bg-[#1C2126] rounded-lg shadow-md mb-4 text-center">
          <p className="text-[#F5F2F4] text-xl font-mono">Time Remaining: {timeRemaining}s</p>
        </div>
      )}
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
      {gameMode !== 'timed' || timerStarted ? (
        <Dice
          rollDice={rollDice}
          holdScore={holdScore}
          isAiTurn={isAiTurn}
          isRolling={isRolling}
          setIsRolling={setIsRolling}
          selectedDice={selectedDice}
          bonusTriggered={bonusTriggered}
        />
      ) : null}
    </div>
  );
}

export default GameBoard;