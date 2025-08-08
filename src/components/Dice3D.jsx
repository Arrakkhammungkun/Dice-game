// src/components/Dice3D.jsx
import React, { useEffect, useRef, useState } from 'react';
import './Dice3D.css';

const faceTransform = {
  1: 'rotateX(0deg) rotateY(0deg)',       // front
  2: 'rotateY(90deg)',                    // left
  3: 'rotateX(-90deg)',                   // top
  4: 'rotateX(90deg)',                    // bottom
  5: 'rotateY(-90deg)',                   // right
  6: 'rotateX(180deg)',                   // back
};

export default function Dice3D({ isRolling, onRoll }) {
  const [value, setValue] = useState(1);
  const diceRef = useRef(null);

  useEffect(() => {
    if (isRolling) {
      const newValue = Math.floor(Math.random() * 6) + 1;
      const audio =new Audio('sounds/dict_sounds.mp3')
      audio.play()
      setValue(newValue);
       
      // เริ่มหมุนแบบสุ่มก่อน แล้วค่อยหยุดที่ค่าที่สุ่มได้
      const randomX = Math.floor(Math.random() * 12) * 30;
      const randomY = Math.floor(Math.random() * 12) * 30;
      const randomZ = Math.floor(Math.random() * 12) * 30;

      diceRef.current.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg) rotateZ(${randomZ}deg)`;

      // หลังจากนั้นหมุนไปหน้าที่ได้จริง
      setTimeout(() => {
        const dice = diceRef.current;
        let hasFired = false;
        const handleTransitionEnd = () => {
          hasFired = true;
          console.log("Dice3D roll complete", newValue);
          onRoll?.(newValue); // ✅ เรียกเมื่อหมุนจบจริง
          dice.removeEventListener('transitionend', handleTransitionEnd);
        };

        dice.addEventListener('transitionend', handleTransitionEnd);
        dice.style.transform = faceTransform[newValue];
      }, 1000);

    }
  }, [isRolling]);

  return (
    <div className="dice-container">
      <div className="dice" ref={diceRef}>
        <div className="dice-face front one">
          <span className="dot"></span>
        </div>

        <div className="dice-face back six">
          <div className="dot-grid six">
            {[...Array(6)].map((_, i) => <span key={i} className="dot"></span>)}
          </div>
        </div>

        <div className="dice-face right five">
          <div className="dot-grid five">
            {[...Array(5)].map((_, i) => <span key={i} className="dot"></span>)}
          </div>
        </div>

        <div className="dice-face left two">
          <div className="dot-grid two">
            {[...Array(2)].map((_, i) => <span key={i} className="dot"></span>)}
          </div>
        </div>

        <div className="dice-face top three">
          <div className="dot-grid three">
            {[...Array(3)].map((_, i) => <span key={i} className="dot"></span>)}
          </div>
        </div>

        <div className="dice-face bottom four">
          <div className="dot-grid four">
            {[...Array(4)].map((_, i) => <span key={i} className="dot"></span>)}
          </div>
        </div>

      </div>
    </div>
  );
}
