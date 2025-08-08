import React from 'react';
import DataManagement from './DataManagement';
const History = ({ gameHistory, setGameHistory }) => {

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
        scoreCounts[p1Name] = (scoreCounts[p1Name] || 0) + game.scores[0];
        scoreCounts[p2Name] = (scoreCounts[p2Name] || 0) + game.scores[1];
        gameCounts[p1Name] = (gameCounts[p1Name] || 0) + 1;
        gameCounts[p2Name] = (gameCounts[p2Name] || 0) + 1;
        stats.highestScore = Math.max(stats.highestScore, game.scores[0], game.scores[1]);
      }

    
      stats.averageDuration += game.duration || 0;

      
      stats.totalRollOnes += game.rollOnesCount || 0;
    });

    // คำนวณเปอร์เซ็นต์การชนะ
    Object.keys(stats.wins).forEach((player) => {
      stats.winPercentage[player] = ((stats.wins[player] / stats.totalGames) * 100).toFixed(1);
    });

    // คำนวณคะแนนเฉลี่ย
    Object.keys(scoreCounts).forEach((player) => {
      stats.averageScore[player] = gameCounts[player]
        ? (scoreCounts[player] / gameCounts[player]).toFixed(1)
        : 0;
    });

    // คำนวณเวลาเฉลี่ย (นาที)
    stats.averageDuration =
      stats.totalGames > 0 ? (stats.averageDuration / stats.totalGames / 60).toFixed(1) : 0;

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
          <table className="w-full text-sm sm:text-base text-[#F5F2F4] border-separate border-spacing-0 rounded-tl-xl rounded-tr-xl border border-[#3B4754] rounded-bl-xl rounded-br-xl">
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
                  <td className="p-2 border-t  border-[#fff] text-white text-start pl-4 ">
                    {game.winner || 'N/A'}
                  </td>
                  <td className="p-2 border-t  border-[#fff] text-start">
                    {game.scores ? game.scores.join(' - ') : 'N/A'}
                  </td>
                  <td className="p-2 border-t border-[#fff] text-start">
                    {Math.floor(game.duration / 60)}:
                    {(game.duration % 60).toString().padStart(2, '0')}
                  </td>
                  <td className="p-2 border-t  border-[#fff] text-start">
                    {game.gameMode === 'vsAI' ? `Vs AI (${game.aiDifficulty})` : '2 Players'}
                  </td>
                  <td className="p-2 border-t  border-[#fff] text-start pl-4">
                    {new Date(game.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      
      <div className="mt-8">
        <h2 className="text-lg sm:text-xl font-mono text-[#F5F2F4] mb-2 sm:mb-4 text-center">
          Game Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 p-1 sm:p-0">
         
          <div className="bg-[#1C2126] p-2 sm:p-4 rounded-lg shadow text-center">
            <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA]">Total Games</h3>
            <p className="text-md sm:text-lg font-mono text-[#F5F2F4]">{stats.totalGames}</p>
          </div>
          <div className="bg-[#1C2126] p-2 sm:p-4 rounded-lg shadow text-center">
            <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA]">Wins</h3>
            {Object.keys(stats.wins).length === 0 ? (
              <p className="text-lg font-mono text-[#F5F2F4] ">No wins</p>
            ) : (
              <div className="text-md sm:text-lg font-mono text-[#F5F2F4]">
                {Object.entries(stats.wins).map(([player, count]) => (
                  <p key={player}>{`${player}: ${count}`}</p>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA]">Win %</h3>
            {Object.keys(stats.winPercentage).length === 0 ? (
              <p className="text-xs sm:text-sm font-mono text-[#F5F2F4]">No data</p>
            ) : (
              <div className="text-md sm:text-lg font-mono text-[#F5F2F4]">
                {Object.entries(stats.winPercentage).map(([player, percent]) => (
                  <p key={player}>{`${player}: ${percent}%`}</p>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA]">Avg. Score</h3>
            {Object.keys(stats.averageScore).length === 0 ? (
              <p className="text-xs sm:text-sm font-mono text-[#F5F2F4]">No data</p>
            ) : (
              <div className="text-md sm:text-lg font-mono text-[#F5F2F4]">
                {Object.entries(stats.averageScore).map(([player, score]) => (
                  <p key={player}>{`${player}: ${score}`}</p>
                ))}
              </div>
            )}
          </div>
          <div className="bg-[#1C2126] p-4 rounded-lg shadow text-center">
            <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA]">Highest Score</h3>
            <p className="text-md sm:text-lg font-mono text-[#F5F2F4]">{stats.highestScore}</p>
          </div>
        </div>

       
        <div className="mt-1 sm:mt-4 bg-[#1C2126] p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA] text-center">Average Game Duration</h3>
          <p className="text-md sm:text-lg font-mono text-[#F5F2F4] text-center">
            {stats.averageDuration} minutes
          </p>
        </div>
        <div className="mt-2 sm:mt-4 bg-[#1C2126] p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm font-mono text-[#9CABBA] text-center">Total Rolls of 1 (Bad Luck)</h3>
          <p className="text-md sm:text-lg font-mono text-[#F5F2F4] text-center">{stats.totalRollOnes}</p>
        </div>
      </div>
      <DataManagement gameHistory={gameHistory} setGameHistory={setGameHistory} />
    </div>
  );
};

export default History;