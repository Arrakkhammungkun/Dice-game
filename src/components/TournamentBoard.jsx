import React from 'react';

function TournamentBoard({ tournamentWins, tournamentConfig, playerNames, tournamentOver }) {
  return (
    <div className="p-4 bg-[#1C2126] rounded-lg shadow-md mb-4 text-center">
      <h2 className="text-xl font-mono text-[#F5F2F4] mb-2">Tournament (Best of {tournamentConfig.bestOf})</h2>
      <p className="text-[#F5F2F4]">Round: {tournamentConfig.currentRound}</p>
      <div className="flex justify-center gap-4">
        <div>
          <p className="text-[#E1A6E4] font-bold">{playerNames[0]}: {tournamentWins[0]} wins</p>
        </div>
        <div>
          <p className="text-[#83FFE7] font-bold">{playerNames[1]}: {tournamentWins[1]} wins</p>
        </div>
      </div>
      {tournamentOver && (
        <p className="text-[#F5F2F4] mt-2 font-bold">
          Tournament Winner: {tournamentWins[0] > tournamentWins[1] ? playerNames[0] : playerNames[1]}!
        </p>
      )}
    </div>
  );
}

export default TournamentBoard;