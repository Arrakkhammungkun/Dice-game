import React, { useState, useEffect,useRef } from 'react';
import ConfirmDelete from './ConfirmDelete';

const DataManagement = ({ gameHistory, setGameHistory }) => {
  const [playerToDelete, setPlayerToDelete] = useState('');
  const [notification, setNotification] = useState('');
  const [fileError, setFileError] = useState('');
  const [inputKey, setInputKey] = useState(Date.now()); 
  const fileInputRef = useRef(null);
  const [modalType, setModalType] = useState(null); 



  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // สำรองข้อมูลอัตโนมัติ
  useEffect(() => {
    try {
      localStorage.setItem('gameHistoryBackup', JSON.stringify(gameHistory));
      showNotification('Data backed up automatically');
    } catch (e) {
      console.error('Failed to save backup:', e);
      showNotification('Backup failed');
    }
  }, [gameHistory]);

  // ส่งออกสถิติเป็น JSON
  const exportStatsToJSON = () => {
    const stats = calculateStats();
    const data = JSON.stringify(stats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game_stats_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Stats exported as JSON');
  };


const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = String(durationInSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds} minute`;
};



  // ส่งออกประวัติเป็น CSV
const exportHistoryToCSV = () => {
  if (gameHistory.length === 0) {
    showNotification('No history to export');
    return;
  }

  const headers = ['ID,Winner,Scores,Duration,Timestamp,GameMode,AI Difficulty,RollOnesCount,PlayerNames'];

  const rows = gameHistory.map((game) => {
    const scores = Array.isArray(game.scores) && game.scores.every(num => typeof num === 'number')
    ? `(${game.scores.map(n => `${n}`).join('-')})`
    : 'N/A';

    const durationFormatted = formatDuration(game.duration || 0);
    return [
      game.id || 'N/A',
      `"${game.winner || 'N/A'}"`,
      `"${scores}"`,
      durationFormatted,
      game.timestamp || 'N/A',
      game.gameMode || 'N/A',
      game.aiDifficulty || 'N/A',
      game.rollOnesCount || 0,
      `"${Array.isArray(game.playerNames) ? game.playerNames.join(',') : 'N/A'}"`
    ].join(',');
  });

  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `game_history_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification('History exported as CSV');
};

  // นำเข้าข้อมูลจากไฟล์
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setFileError('Please upload a JSON file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // ตรวจสอบว่าเป็นไฟล์สถิติ
        if (
          !Array.isArray(data) &&
          data.totalGames !== undefined &&
          data.wins !== undefined &&
          data.winPercentage !== undefined
        ) {
          setFileError('This is a stats file, please import a game history JSON file');
          return;
        }
        // ตรวจสอบว่าเป็น array
        if (!Array.isArray(data)) {
          setFileError('Invalid file format: must be an array of game history');
          return;
        }
        // ตรวจสอบโครงสร้างข้อมูล
        const isValid = data.every((game) =>
          game.id &&
          game.winner &&
          Array.isArray(game.scores) &&
          game.scores.every(num => typeof num === 'number') &&
          game.timestamp &&
          Array.isArray(game.playerNames)
        );
        if (!isValid) {
          setFileError('Invalid data structure: missing required fields or invalid scores (id, winner, scores, timestamp, playerNames)');
          return;
        }
        setGameHistory(data);
        localStorage.setItem('gameHistory', JSON.stringify(data));
        setFileError('');
        showNotification('Data imported successfully');
      } catch (err) {
        setFileError('Failed to parse JSON file: invalid JSON format');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
  };

  const confirmDeletePlayerHistory = () => {
    if (!playerToDelete.trim()) {
        showNotification('Please enter a player name');
        return;
    }
    setModalType('deleteHistory'); 
    };

  // ลบประวัติเฉพาะผู้เล่น
    const deletePlayerHistory = () => {
    const trimmedName = playerToDelete.trim();
    const updatedHistory = gameHistory.filter(
        (game) =>
        game.winner !== trimmedName &&
        (!game.playerNames || !game.playerNames.includes(trimmedName))
    );
    setGameHistory(updatedHistory);
    localStorage.setItem('gameHistory', JSON.stringify(updatedHistory));
    showNotification(`History for ${trimmedName} deleted`);
    setPlayerToDelete('');
    setModalType(null); 
    };

  // รีเซ็ตข้อมูลทั้งหมด
  const resetAllData = () => {
    if (!window.confirm('Are you sure you want to reset all data? This cannot be undone.')) return;
    setGameHistory([]);
    localStorage.removeItem('gameHistory');
    localStorage.removeItem('gameHistoryBackup');
    setInputKey(Date.now()); 
    if (fileInputRef.current) fileInputRef.current.value = ''; 
    showNotification('All data reset');
  };
  // คำนวณสถิติ
  const calculateStats = () => {
    if (gameHistory.length === 0) {
      return {
        totalGames: 0,
        wins: {},
        winPercentage: {},
        averageScore: {},
        highestScore: 0,
        averageDuration: 0,
        totalRollOnes: 0,
      };
    }

    const stats = {
      totalGames: gameHistory.length,
      wins: {},
      winPercentage: {},
      averageScore: {},
      highestScore: 0,
      averageDuration: 0,
      totalRollOnes: 0,
    };

    const scoreCounts = {};
    const gameCounts = {};

    gameHistory.forEach((game) => {
      const winner = game.winner || 'Unknown';
      stats.wins[winner] = (stats.wins[winner] || 0) + 1;

      if (game.scores && game.scores.length === 2 && game.playerNames && game.playerNames.length === 2) {
        const [p1Name, p2Name] = game.playerNames;
        scoreCounts[p1Name] = (scoreCounts[p1Name] || 0) + (typeof game.scores[0] === 'number' ? game.scores[0] : 0);
        scoreCounts[p2Name] = (scoreCounts[p2Name] || 0) + (typeof game.scores[1] === 'number' ? game.scores[1] : 0);
        gameCounts[p1Name] = (gameCounts[p1Name] || 0) + 1;
        gameCounts[p2Name] = (gameCounts[p2Name] || 0) + 1;
        stats.highestScore = Math.max(
          stats.highestScore,
          typeof game.scores[0] === 'number' ? game.scores[0] : 0,
          typeof game.scores[1] === 'number' ? game.scores[1] : 0
        );
      }

      stats.averageDuration += game.duration || 0;
      stats.totalRollOnes += game.rollOnesCount || 0;
    });

    Object.keys(stats.wins).forEach((player) => {
      stats.winPercentage[player] = ((stats.wins[player] / stats.totalGames) * 100).toFixed(1);
    });

    Object.keys(scoreCounts).forEach((player) => {
      stats.averageScore[player] = gameCounts[player]
        ? (scoreCounts[player] / gameCounts[player]).toFixed(1)
        : 0;
    });

    stats.averageDuration =
      stats.totalGames > 0 ? (stats.averageDuration / stats.totalGames / 60).toFixed(1) : 0;

    return stats;
  };

  return (
    <div className="mt-6 bg-[#1C2126] p-4 rounded-lg shadow mb-4 ">
      <h2 className="text-lg sm:text-xl font-mono text-[#F5F2F4] mb-4 text-center">
        Data Management
      </h2>

        {notification && (
        <div className=" text-center text-sm sm:text-base text-[#4B8A65]  p-1 rounded">
          {notification}4
        </div>
        )}
      {fileError && (
        <div className=" text-center text-sm sm:text-base text-red-500  p-2 rounded">
          {fileError}4
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center flex-wrap">
        <button
          onClick={exportStatsToJSON}
          className="px-4 py-2 bg-[#4B8A65] text-white rounded hover:bg-[#5F9F7A] text-sm sm:text-base"
        >
          Export Stats (JSON)
        </button>
        <button
          onClick={exportHistoryToCSV}
          className="px-4 py-2 bg-[#4B8A65] text-white rounded hover:bg-[#5F9F7A] text-sm sm:text-base"
        >
          Export History (CSV)
        </button>
        <label className="px-4 py-2 bg-[#4B8A65] text-center text-white rounded hover:bg-[#5F9F7A] text-sm sm:text-base cursor-pointer relative group">
          Import Data
         <input
            key={inputKey}
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />

        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={playerToDelete}
            onChange={(e) => setPlayerToDelete(e.target.value)}
            placeholder="Enter player name"
            className="px-2 py-1 bg-[#3B4754] text-[#F5F2F4] rounded text-sm sm:text-base focus:outline-none"
          />
          <button
            onClick={confirmDeletePlayerHistory}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
          >
            Delete Player History
          </button>
        </div>
        <button
            onClick={() => setModalType('resetAll')}    
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
        >
          Reset All Data
        </button>
      </div>
        <ConfirmDelete
            isOpen={modalType === 'deleteHistory'}
            onCancel={() => setModalType(null)}
            onConfirm={deletePlayerHistory}
            title="ลบประวัติผู้เล่น?"
            description={`คุณแน่ใจหรือไม่ว่าต้องการลบประวัติของ "${playerToDelete}" ?`}
            confirmText="ลบเลย"
        />
         <ConfirmDelete
            isOpen={modalType === 'resetAll'}
            onCancel={() => setModalType(null)}
            onConfirm={resetAllData}
            title="รีเซ็ตข้อมูลทั้งหมด?"
            description="คุณต้องการล้างข้อมูลทั้งหมดใช่หรือไม่?"
            confirmText="รีเซ็ต"
        />
    </div>
  );
};

export default DataManagement;