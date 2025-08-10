
import React, { useRef } from "react";

const availableSounds = [
  "success.mp3",
  "success_bank.mp3",
  "fail.mp3",
  "win.mp3",
  "round_win.mp3",
];

const Roll_Success = ["success.mp3", "score1.mp3", "score2.mp3","success_bank.mp3",];
const Win = ["Win2.mp3", "Win3.mp3", "win.mp3"];
const _soundsfail = ["fail1.mp3", "fail2.mp3"];
const Score_Sound = ["level_1.mp3", "levelup_2.mp3", "levelup_3.mp3"];

const AudioSettings = ({ sounds, setSounds }) => {
  const audioRef = useRef(null); 

  const playSoundWithFade = (file) => {
    if (audioRef.current) {
     
      let volume = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (volume > 0.05) {
          volume -= 0.05;
          audioRef.current.volume = volume;
        } else {
          clearInterval(fadeOut);
          audioRef.current.pause();
          audioRef.current = null;
          startNewAudio(file);
        }
      }, 30);
    } else {
      startNewAudio(file);
    }
  };
  //ทดสอบเสียง
  const startNewAudio = (file) => {
    const audio = new Audio(`/sounds/${file}`); 
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().catch((err) => console.error("Error playing sound:", err));

    
    let volume = 0;
    const fadeIn = setInterval(() => {
      if (volume < 1) {
        volume += 0.05;
        audio.volume = volume;
      } else {
        clearInterval(fadeIn);
      }
    }, 30);
  };
  // กดเพื่อเปลี่ยนเสียง
  const handleChange = (key, value) => {
    setSounds((prev) => ({ ...prev, [key]: value }));
    playSoundWithFade(value);
  };

  return (
    <div className="p-4 bg-[#1C2126] rounded-lg shadow-md">
      <h2 className="text-xl font-mono text-[#F5F2F4] mb-4">Audio Settings</h2>

    
      <div className="mb-4">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">
          Roll Success Sound
        </label>
        <select
          value={sounds.rollSuccess}
          onChange={(e) => handleChange("rollSuccess", e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563]"
        >
          {Score_Sound.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

     
      <div className="mb-4">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">
          Bank Score Sound (เก็บแต้ม)
        </label>
        <select
          value={sounds.bank}
          onChange={(e) => handleChange("bank", e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563]"
        >
          {Roll_Success.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

     
      <div className="mb-4">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">
          Fail Sound (Roll 1)
        </label>
        <select
          value={sounds.fail}
          onChange={(e) => handleChange("fail", e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563]"
        >
          {_soundsfail.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

     
      <div className="mb-4">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">
          Game Win Sound (ชนะเกม)
        </label>
        <select
          value={sounds.win}
          onChange={(e) => handleChange("win", e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563]"
        >
          {Win.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      
      <div className="mb-4">
        <label className="block mb-1 text-xs sm:text-sm font-semibold text-[#F5F2F4]">
          Round Win Sound (ชนะต่อรอบ)
        </label>
        <select
          value={sounds.roundWin}
          onChange={(e) => handleChange("roundWin", e.target.value)}
          className="w-full p-2 sm:p-3 border-2 rounded-xl bg-[#2F3640] text-[#FFFFFF] border-[#4B5563]"
        >
          {availableSounds.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AudioSettings;
