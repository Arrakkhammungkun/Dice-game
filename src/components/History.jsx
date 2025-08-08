import React from 'react';

const History = ({ gameHistory }) => {
  const clearHistory = () => {
    try {
      localStorage.removeItem('gameHistory');
      window.dispatchEvent(new StorageEvent('storage', { key: 'gameHistory', newValue: null }));
      console.log('History cleared from localStorage');
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  // คำนวณสถิติ
  const calculateStats = () => {
    if (gameHistory.length === 0) {
      return {
        totalGames: 0,
        wins: { 'Player 1': 0, 'Player 2': 0, AI: 0 },
        winPercentage: { 'Player 1': 0, 'Player 2': 0, AI: 0 },
        averageScore: { 'Player 1': 0, 'Player 2': 0, AI: 0 },
        highestScore: 0,
        averageDuration: 0,
        totalRollOnes: 0,
      };
    }

    const stats = {
      totalGames: gameHistory.length,
      wins: { 'Player 1': 0, 'Player 2': 0, AI: 0 },
      winPercentage: { 'Player 1': 0, 'Player 2': 0, AI: 0 },
      averageScore: { 'Player 1': 0, 'Player 2': 0, AI: 0 },
      highestScore: 0,
      averageDuration: 0,
      totalRollOnes: 0,
    };

    let totalP1Score = 0;
    let totalP2Score = 0;
    let totalDuration = 0;
    let totalGamesP1 = 0;
    let totalGamesP2 = 0;

    gameHistory.forEach((game) => {
      // จำนวนการชนะ
      if (game.winner === 'Player 1') {
        stats.wins['Player 1'] += 1;
      } else if (game.winner === 'Player 2' || game.winner === 'AI') {
        stats.wins[game.gameMode === 'vsAI' ? 'AI' : 'Player 2'] += 1;
      }

      // คะแนน
      if (game.scores && game.scores.length === 2) {
        totalP1Score += game.scores[0];
        totalP2Score += game.scores[1];
        totalGamesP1 += 1;
        totalGamesP2 += 1;
        stats.highestScore = Math.max(stats.highestScore, game.scores[0], game.scores[1]);
      }

      // ระยะเวลา
      totalDuration += game.duration || 0;

      // จำนวนครั้งทอยได้ 1
      stats.totalRollOnes += game.rollOnesCount || 0;
    });

    // คำนวณเปอร์เซ็นต์การชนะ
    stats.winPercentage['Player 1'] =
      stats.totalGames > 0 ? ((stats.wins['Player 1'] / stats.totalGames) * 100).toFixed(1) : 0;
    stats.winPercentage['Player 2'] =
      stats.totalGames > 0
        ? ((stats.wins['Player 2'] / stats.totalGames) * 100).toFixed(1)
        : 0;
    stats.winPercentage['AI'] =
      stats.totalGames > 0 ? ((stats.wins['AI'] / stats.totalGames) * 100).toFixed(1) : 0;

    // คำนวณคะแนนเฉลี่ย
    stats.averageScore['Player 1'] =
      totalGamesP1 > 0 ? (totalP1Score / totalGamesP1).toFixed(1) : 0;
    stats.averageScore['Player 2'] =
      totalGamesP2 > 0 ? (totalP2Score / totalGamesP2).toFixed(1) : 0;
    stats.averageScore['AI'] = stats.averageScore['Player 2']; // ในโหมด vsAI, Player 2 คือ AI

    // คำนวณเวลาเฉลี่ย
    stats.averageDuration =
      stats.totalGames > 0 ? (totalDuration / stats.totalGames / 60).toFixed(1) : 0;

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="p-2 sm:p-4 bg-[#121417]/95 rounded-lg shadow-lg max-w-6xl mx-auto min-h-screen">
      <h2 className="text-lg sm:text-xl font-mono text-[#F5F2F4] mb-4 text-center">
        Game History (Last 10 Games)
      </h2>
      {gameHistory.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-[#F5F2F4]">
          No game history available.
        </p>
      ) : (
        <div className="overflow-x-auto shadow">
          <table className="w-full text-sm sm:text-base text-[#F5F2F4] border-separate border-spacing-0 rounded-tl-xl rounded-tr-xl border border-[#3B4754]">
            <thead>
              <tr className="bg-[#1C2126]">
                <th className="p-2 rounded-tl-xl text-start pl-4">Winner</th>
                <th className="p-2 text-start">Scores (Total)</th>
                <th className="p-2 text-start">Duration</th>
                <th className="p-2 text-start">Mode</th>
                <th className="p-2 rounded-tr-xl text-start">Date</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.slice(0, 10).map((game) => (
                <tr key={game.id} className="hover:bg-[#536171] text-[#9CABBA]">
                  <td className="p-2 border-t border-b border-[#3B4754] text-white text-start pl-4">
                    {game.winner || 'N/A'}
                  </td>
                  <td className="p-2 border-t border-b border-[#3B4754] text-start">
                    {game.scores ? game.scores.join(' - ') : 'N/A'}
                  </td>
                  <td className="p-2 border-t border-b border-[#3B4754] text-start">
                    {Math.floor(game.duration / 60)}:
                    {(game.duration % 60).toString().padStart(2, '0')}
                  </td>
                  <td className="p-2 border-t border-b border-[#3B4754] text-start">
                    {game.gameMode === 'vsAI' ? `Vs AI (${game.aiDifficulty})` : '2 Players'}
                  </td>
                  <td className="p-2 border-t border-b border-[#3B4754] text-start pl-4">
                    {new Date(game.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={clearHistory}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
      >
        Clear History
      </button>

      {/* ระบบสถิติ */}
      <div className="mt-8">
        <h2 className="text-lg sm:text-xl font-mono text-[#F5F2F4] mb-4 text-center">
          Game Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {/* กล่องเล็ก 5 กล่อง */}
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-mono text-[#9CABBA]">Total Games</h3>
            <p className="text-lg font-mono text-[#F5F2F4]">{stats.totalGames}</p>
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-mono text-[#9CABBA]">Wins</h3>
            <p className="text-lg font-mono text-[#F5F2F4]">
              P1: {stats.wins['Player 1']} |{' '}
              {stats.wins['Player 2'] + stats.wins['AI'] > 0
                ? `${stats.wins['AI'] > 0 ? 'AI' : 'P2'}: ${stats.wins['Player 2'] + stats.wins['AI']}`
                : ''}
            </p>
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-mono text-[#9CABBA]">Win %</h3>
            <p className="text-lg font-mono text-[#F5F2F4]">
              P1: {stats.winPercentage['Player 1']}% |{' '}
              {stats.wins['Player 2'] + stats.wins['AI'] > 0
                ? `${stats.wins['AI'] > 0 ? 'AI' : 'P2'}: ${stats.winPercentage['Player 2']}%`
                : ''}
            </p>
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-mono text-[#9CABBA]">Avg. Score</h3>
            <p className="text-lg font-mono text-[#F5F2F4]">
              P1: {stats.averageScore['Player 1']} |{' '}
              {stats.wins['Player 2'] + stats.wins['AI'] > 0
                ? `${stats.wins['AI'] > 0 ? 'AI' : 'P2'}: ${stats.averageScore['Player 2']}`
                : ''}
            </p>
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-mono text-[#9CABBA]">Highest Score</h3>
            <p className="text-lg font-mono text-[#F5F2F4]">{stats.highestScore}</p>
          </div>
        </div>
        {/* กล่องยาว 2 กล่อง */}
        <div className="mt-4 bg-[#1C2126] p-4 rounded-lg shadow">
          <h3 className="text-sm font-mono text-[#9CABBA] text-center">Average Game Duration</h3>
          <p className="text-lg font-mono text-[#F5F2F4] text-center">
            {stats.averageDuration} minutes
          </p>
        </div>
        <div className="mt-4 bg-[#1C2126] p-4 rounded-lg shadow">
          <h3 className="text-sm font-mono text-[#9CABBA] text-center">Total Rolls of 1 (Bad Luck)</h3>
          <p className="text-lg font-mono text-[#F5F2F4] text-center">{stats.totalRollOnes}</p>
        </div>
      </div>
    </div>
  );
};

export default History;