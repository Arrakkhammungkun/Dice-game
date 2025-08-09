import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import ClaimRewardModal from './Model/ClaimRewardModal';

const Audio_levelup = new Audio('sounds/levelup.mp3');

const Achievements = ({ gameHistory }) => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [claimedAchievements, setClaimedAchievements] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    try {
      const savedClaimed = localStorage.getItem('claimedAchievements');
      if (savedClaimed) {
        const parsed = JSON.parse(savedClaimed);
        if (typeof parsed === 'object' && parsed !== null) {
          setClaimedAchievements(parsed);
        } else {
          console.warn('Invalid claimedAchievements format in localStorage, resetting to {}');
          setClaimedAchievements({});
        }
      }
      setIsLoaded(true);
    } catch (e) {
      console.error('Failed to load claimedAchievements from localStorage:', e);
      setClaimedAchievements({});
      setIsLoaded(true);
    }
  }, []);

  // บันทึกสถานะการรับรางวัลเมื่อ claimedAchievements เปลี่ยน
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('claimedAchievements', JSON.stringify(claimedAchievements));
    } catch (e) {
      console.error('Failed to save claimedAchievements to localStorage:', e);
    }
  }, [claimedAchievements, isLoaded]);

  const calculateAchievements = () => {
    const achievementsData = {};
    let consecutiveWins = {};

    // eslint-disable-next-line no-unused-vars
    gameHistory.forEach((game, index) => {
      const [p1Name, p2Name] = game.playerNames || ['Unknown', 'Unknown'];
      const scores = game.tournamentWinner ? game.tournamentWins || [0, 0] : game.scores || [0, 0];
      const winner = game.tournamentWinner || game.winner || 'Unknown';

 
      [p1Name, p2Name].forEach((player) => {
        if (!achievementsData[player]) {
          achievementsData[player] = {
            gamesPlayed: 0,
            wins: 0,
            shutout: false,
            threeConsecutiveWins: false,
            threeConsecutiveOnes: false,
          };
        }
        if (!consecutiveWins[player]) consecutiveWins[player] = 0;
      });

    
      achievementsData[p1Name].gamesPlayed += 1;
      achievementsData[p2Name].gamesPlayed += 1;

      // Skill Challenge สายโหด
      if (winner === p1Name && scores[1] === 0) {
        achievementsData[p1Name].shutout = true;
      } else if (winner === p2Name && scores[0] === 0) {
        achievementsData[p2Name].shutout = true;
      }

      // Skill Challenge
      Object.keys(consecutiveWins).forEach((player) => {
        if (player !== winner) {
          consecutiveWins[player] = 0;
        }
      });
      if (winner === p1Name) {
        consecutiveWins[p1Name] += 1;
        if (consecutiveWins[p1Name] >= 3) {
          achievementsData[p1Name].threeConsecutiveWins = true;
        }
      } else if (winner === p2Name) {
        consecutiveWins[p2Name] += 1;
        if (consecutiveWins[p2Name] >= 3) {
          achievementsData[p2Name].threeConsecutiveWins = true;
        }
      }

      // Skill  Unlucky 
      if (game.consecutiveOnes && Array.isArray(game.consecutiveOnes)) {
        const [p1Ones, p2Ones] = game.consecutiveOnes;
        if (p1Ones >= 3) {
          achievementsData[p1Name].threeConsecutiveOnes = true;
        }
        if (p2Ones >= 3) {
          achievementsData[p2Name].threeConsecutiveOnes = true;
        }
      }
    });

    // Convert to array for display
    return Object.entries(achievementsData)
      .map(([name, data]) => ({
        name,
        milestones: [
          { name: 'มือใหม่', achieved: data.gamesPlayed >= 1, description: 'เล่นครบ 1 เกม' },
          { name: 'นักเล่นตัวยง', achieved: data.gamesPlayed >= 10, description: 'เล่นครบ 10 เกม' },
        ],
        challenges: [
          { name: 'สายโหด', achieved: data.shutout, description: 'ชนะโดยคู่แข่งไม่มีคะแนนเลย' },
          { name: 'ชนะรวด', achieved: data.threeConsecutiveWins, description: 'ชนะติดกัน 3 ครั้ง' },
          { name: 'Unlucky', achieved: data.threeConsecutiveOnes, description: 'ทอยได้ 1 สามครั้งติด' },
        ],
      }))
      .sort((a, b) => {
        const aAchievements = [...a.milestones, ...a.challenges].filter((a) => a.achieved).length;
        const bAchievements = [...b.milestones, ...b.challenges].filter((b) => b.achieved).length;
        return bAchievements - aAchievements;
      });
  };

  const handleClaimReward = (playerName, achievement) => {
   
    const key = `${playerName}_${achievement.name}`;
    if (claimedAchievements[key]) {
      console.warn(`Achievement ${key} already claimed`);
      return;
    }

    Audio_levelup.currentTime = 0;
    Audio_levelup.play().catch((e) => console.error('Failed to play levelup sound:', e));
    setSelectedAchievement({ ...achievement, playerName });
    setIsModalOpen(true);
 
    setClaimedAchievements((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  const achievements = calculateAchievements();


  if (!isLoaded) {
    return (
      <div className="p-2 sm:p-4 bg-[#121417]/95 rounded-lg shadow-lg max-w-6xl mx-auto min-h-screen">
        <p className="text-center text-sm sm:text-base text-[#F5F2F4]">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 bg-[#121417]/95 rounded-lg shadow-lg max-w-6xl mx-auto min-h-screen">
      <h2 className="text-lg sm:text-xl font-mono text-[#F5F2F4] mb-4 text-center">
        Achievements
      </h2>
      {achievements.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-[#F5F2F4]">
          No achievements available.
        </p>
      ) : (
        <div className="space-y-6">
          {achievements.map((player) => (
            <div key={player.name} className="bg-[#1C2126] p-4 rounded-lg shadow">
              <h3 className="text-md sm:text-lg font-mono text-[#F5F2F4] mb-2">{player.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-mono text-[#9CABBA] mb-2">Milestones</h4>
                  {player.milestones.map((milestone) => (
                    <div key={milestone.name} className="flex items-center gap-2 mb-1 text-sm">
                      <span className="flex items-center gap-2">
                        {milestone.achieved ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-[#6B5DA9] text-sm font-bold sm:text-md"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="text-[#6B5DA9] text-sm sm:text-md"
                          />
                        )}
                        <span className={milestone.achieved ? 'text-[#4B8A65]' : 'text-[#9CABBA]'}>
                          {milestone.name}
                        </span>
                      </span>
                      <span className="text-xs text-[#F5F2F4]">{milestone.description}</span>
                      {milestone.achieved && !claimedAchievements[`${player.name}_${milestone.name}`] && (
                        <button
                          onClick={() => handleClaimReward(player.name, milestone)}
                          className=" sm:ml-2 px-2 py-1 bg-[#4B8A65] text-white rounded text-xs hover:bg-[#5F9F7A]   whitespace-nowrap"
                        >
                          รับรางวัล
                        </button>
                      )}
                      {milestone.achieved && claimedAchievements[`${player.name}_${milestone.name}`] && (
                        <span className="ml-2 text-xs text-[#4B8A65]">ได้รับแล้ว</span>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-mono text-[#9CABBA] mb-2">Skill Challenges</h4>
                  {player.challenges.map((challenge) => (
                    <div key={challenge.name} className="flex items-center gap-2 mb-1 text-sm">
                      <span className="flex items-center gap-2">
                        {challenge.achieved ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-[#6B5DA9] text-sm font-bold sm:text-md"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="text-[#6B5DA9] text-sm sm:text-md"
                          />
                        )}
                        <span className={challenge.achieved ? 'text-[#4B8A65]' : 'text-[#9CABBA]'}>
                          {challenge.name}
                        </span>
                      </span>
                      <span className="text-xs text-[#F5F2F4]">{challenge.description}</span>
                      {challenge.achieved && !claimedAchievements[`${player.name}_${challenge.name}`] && (
                        <button
                          onClick={() => handleClaimReward(player.name, challenge)}
                          className="ml-2 px-2 py-1 bg-[#4B8A65] text-white rounded text-xs hover:bg-[#5F9F7A]  whitespace-nowrap"
                        >
                          รับรางวัล
                        </button>
                      )}
                      {challenge.achieved && claimedAchievements[`${player.name}_${challenge.name}`] && (
                        <span className="ml-2 text-xs text-[#4B8A65]">ได้รับแล้ว</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ClaimRewardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </div>
  );
};

export default Achievements;