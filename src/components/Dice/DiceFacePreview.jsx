import React, { useRef,  } from 'react';
import './Dice3D.css'; 



export default function DiceFacePreview({ diceStyle }) {
  const diceRef = useRef(null);



  return (
    <div className={`dice-container dice-${diceStyle || 'default'} dice-preview`}>
      <div className="dice" ref={diceRef}>
        <div className="dice-face front one">
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
}