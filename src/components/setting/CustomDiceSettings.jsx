import React from "react";

export default function CustomDiceSettings({
  selectedDice,
  setSelectedDice,
  selectedTheme,
  setSelectedTheme,
}) {
  const diceOptions = [
    { id: "default", name: "Default Dice", image: "/dice/default.png" },
    { id: "red", name: "Red Dice", image: "/dice/red.png" },
    { id: "gold", name: "Golden Dice", image: "/dice/gold.png" },
  ];

  const themes = [
    { id: "classic", name: "Classic", preview: "/themes/classic.png" },
    { id: "dark", name: "Dark Mode", preview: "/themes/dark.png" },
    { id: "neon", name: "Neon Glow", preview: "/themes/neon.png" },
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

  return (
    <div className="flex flex-col gap-6">
      {/* เลือกลูกเต๋า */}
      <div>
        <h2 className="text-lg font-bold text-white">🎲 Select Dice Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {diceOptions.map(dice => (
            <div
              key={dice.id}
              onClick={() => setSelectedDice(dice.id)}
              className={`cursor-pointer p-2 rounded-lg border ${
                selectedDice === dice.id
                  ? "border-green-400 bg-green-900/40"
                  : "border-gray-500"
              } hover:border-green-300`}
            >
              <img
                src={dice.image}
                alt={dice.name}
                className="w-full h-20 object-contain"
              />
              <p className="text-center text-white mt-2">{dice.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ปุ่ม Fullscreen */}
      <div>
        <h2 className="text-lg font-bold text-white">🖥 Fullscreen Mode</h2>
        <button
          onClick={toggleFullScreen}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
        >
          Toggle Fullscreen
        </button>
      </div>

      {/* เลือก Theme */}
      <div>
        <h2 className="text-lg font-bold text-white">🎨 Select Theme</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {themes.map(theme => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`cursor-pointer p-2 rounded-lg border ${
                selectedTheme === theme.id
                  ? "border-green-400 bg-green-900/40"
                  : "border-gray-500"
              } hover:border-green-300`}
            >
              <img
                src={theme.preview}
                alt={theme.name}
                className="w-full h-20 object-cover rounded"
              />
              <p className="text-center text-white mt-2">{theme.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
