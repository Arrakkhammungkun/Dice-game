import React from 'react';

const Leaderboard = ({ gameHistory }) => {
  // คำนวณอันดับจากประวัติทัวร์นาเมนต์
  const calculateLeaderboard = () => {
    const leaderboardData = {};

    // กรองเฉพาะเกมในโหมดทัวร์นาเมนต์ที่มีผู้ชนะ
    const tournamentGames = gameHistory.filter(
      (game) => game.gameMode === 'tournament' && game.tournamentWinner
    );

    tournamentGames.forEach((game) => {
      const winner = game.tournamentWinner;
      const [p1Name, p2Name] = game.playerNames || ['Unknown', 'Unknown'];
      const [p1Wins, p2Wins] = game.tournamentWins || [0, 0];

      // อัปเดตข้อมูลสำหรับผู้เล่นแต่ละคน
      if (!leaderboardData[p1Name]) {
        leaderboardData[p1Name] = { wins: 0, matches: 0, totalRoundsWon: 0 };
      }
      if (!leaderboardData[p2Name]) {
        leaderboardData[p2Name] = { wins: 0, matches: 0, totalRoundsWon: 0 };
      }

      // เพิ่มจำนวนแมตช์ที่เล่น
      leaderboardData[p1Name].matches += 1;
      leaderboardData[p2Name].matches += 1;

      // เพิ่มจำนวนรอบที่ชนะ
      leaderboardData[p1Name].totalRoundsWon += p1Wins;
      leaderboardData[p2Name].totalRoundsWon += p2Wins;

      // เพิ่มจำนวนครั้งที่ชนะทัวร์นาเมนต์
      if (winner === p1Name) {
        leaderboardData[p1Name].wins += 1;
      } else if (winner === p2Name) {
        leaderboardData[p2Name].wins += 1;
      }
    });

    // แปลงข้อมูลเป็น array และจัดเรียงตามจำนวนครั้งที่ชนะ
    const leaderboardArray = Object.entries(leaderboardData)
      .map(([name, data]) => ({
        name,
        wins: data.wins,
        matches: data.matches,
        totalRoundsWon: data.totalRoundsWon,
        winPercentage: data.matches > 0 ? ((data.wins / data.matches) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.wins - a.wins || b.totalRoundsWon - a.totalRoundsWon);

    return leaderboardArray;
  };

  const leaderboard = calculateLeaderboard();

  return (
    <div className="p-2 sm:p-4 bg-[#121417]/95 rounded-lg shadow-lg max-w-6xl mx-auto min-h-screen">
      <h2 className="text-lg sm:text-xl font-mono text-[#F5F2F4] mb-4 text-center">
        Tournament Leaderboard
      </h2>
      {leaderboard.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-[#F5F2F4]">
          No tournament history available.
        </p>
      ) : (
        <div className="overflow-x-auto shadow">
          <table className="w-full text-sm sm:text-base text-[#F5F2F4] border-separate border-spacing-0 rounded-tl-xl rounded-tr-xl border border-[#3B4754] rounded-bl-xl rounded-br-xl">
            <thead>
              <tr className="bg-[#1C2126]">
                <th className="p-2 rounded-tl-xl text-start pl-4">Rank</th>
                <th className="p-2 text-start">Player</th>
                <th className="p-2 text-start">Wins</th>
                <th className="p-2 text-start">Matches Played</th>
                <th className="p-2 text-start">Win %</th>
                <th className="p-2 rounded-tr-xl text-start">Total Rounds Won</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={player.name} className="hover:bg-[#536171] text-[#9CABBA]">
                  <td className="p-2 border-t border-[#fff] text-white text-start pl-4">
                    {index + 1}
                  </td>
                  <td className="p-2 border-t border-[#fff] text-start">{player.name}</td>
                  <td className="p-2 border-t border-[#fff] text-start">{player.wins}</td>
                  <td className="p-2 border-t border-[#fff] text-start">{player.matches}</td>
                  <td className="p-2 border-t border-[#fff] text-start">{player.winPercentage}%</td>
                  <td className="p-2 border-t border-[#fff] text-start">{player.totalRoundsWon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;