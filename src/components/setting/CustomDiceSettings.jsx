import React, { useState } from "react";
import DiceFacePreview from "../Dice/DiceFacePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";

export default function CustomDiceSettings({
  selectedDice,
  selectedTheme,
  setSelectedTheme,
  onDiceChange,
}) {
  // eslint-disable-next-line no-unused-vars
  const [temporarySelectedDice, setTemporarySelectedDice] = useState(selectedDice); 

  const diceOptions = [
    { id: "default", name: "Default Dice" },
    { id: "red", name: "Red Dice" },
    { id: "black", name: "Black Dice" },
  ];

  const themes = [
    { id: "light", name: "Light Mode", color: "#ffffff" },
    { id: "dark", name: "Dark Mode", color: "#3333" },
    { id: "colorful", name: "Colorful Mode", color: "#ECE3CA" },
  ];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDiceSelect = (diceId) => {
    setTemporarySelectedDice(diceId); 
    onDiceChange(diceId); 
  };

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId); 

  };

  return (
    <div className="flex flex-col gap-6">
  
      <div>
        <h2 className="text-lg font-mono text-white "> Select Dice Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {diceOptions.map(dice => (
            <div
              key={dice.id}
               onClick={() => handleDiceSelect(dice.id)}
              className={`cursor-pointer p-2 rounded-lg border ${
                selectedDice === dice.id
                  ? "border-green-400 bg-green-900/40"
                  : "border-gray-500"
              } hover:border-green-300`}
            >
              <div className="mt-2">
                  <DiceFacePreview  diceStyle={dice.id} face={1} />
              </div>
              <p className="text-center text-white mt-2 font-mono">{dice.name}</p>
            </div>
          ))}
        </div>
      </div>
 
      <div>
        <h2 className="text-lg font-mono text-white"> Fullscreen Mode</h2>

        <button
          onClick={toggleFullScreen}
          className="px-4 py-2 flex items-center gap-1 bg-blue-500 text-white rounded hover:bg-blue-700 mt-2"
        >
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} size="1x" />
          Fullscreen
        </button>
      </div>

      
      <div>
        <h2 className="text-lg font-mono text-white"> Select Theme</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {themes.map(theme => (
            <div
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              className={`cursor-pointer p-2 rounded-lg border ${
                selectedTheme === theme.id
                  ? "border-green-400 bg-green-900/40"
                  : "border-gray-500"
              } hover:border-green-300`}
            >
              <div
                className="w-full h-20 rounded  border-white border"
                style={{ backgroundColor: theme.color }}
              >

              </div>
              <p className="text-center text-white mt-2">{theme.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}