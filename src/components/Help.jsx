import React from 'react';

const Help = ({setView}) => {
    const handleClick = () => {
    setView('game');

  }; 
  return (
    <div className="p-6 bg-[#1C2126] rounded-lg shadow-md text-[#F5F2F4] font-mono max-w-4xl mx-auto mt-4">
      <h1 className="text-2xl font-bold text-center mb-6">ระบบช่วยเหลือ</h1>

      
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#E1A6E4] mb-3">คู่มือการเล่น</h2>
        <p className="text-base leading-relaxed">
          เกมนี้เป็นเกมทอยลูกเต๋าแบบผลัดกันเล่นสำหรับผู้เล่น 2 คน (หรือผู้เล่นกับ AI) โดยมีเป้าหมายคือสะสมคะแนนให้ถึงเป้าหมาย (เช่น 100 คะแนน) เพื่อชนะ
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li><strong>ทอยลูกเต๋า (Roll Dice):</strong> ผู้เล่นกดปุ่ม "Roll Dice" เพื่อทอยลูกเต๋า (1-6) คะแนนที่ทอยได้จะสะสมในคะแนนปัจจุบัน</li>
          <li><strong>เก็บคะแนน (Hold Score):</strong> กดปุ่ม "Hold Score" เพื่อเก็บคะแนนปัจจุบันไปยังคะแนนรวม และเปลี่ยนผู้เล่น</li>
          <li><strong>ทอยได้ 1:</strong> หากทอยได้ 1 คะแนนปัจจุบันจะถูกรีเซ็ตเป็น 0 และเปลี่ยนผู้เล่นทันที</li>
          <li><strong>เริ่มเกมใหม่ (New Game):</strong> รีเซ็ตเกมทั้งหมดเพื่อเริ่มเล่นใหม่</li>
          <li><strong>โหมดการเล่น:</strong> เลือกได้ระหว่าง 2 ผู้เล่น หรือเล่นกับคอมพิวเตอร์ (AI) ที่มีระดับความยากง่าย, ปานกลาง, หรือยาก</li>
          <li><strong>ชัยชนะ:</strong> ผู้เล่นที่ถึงคะแนนเป้าหมาย (เช่น 100) ก่อนจะเป็นผู้ชนะ</li>
          <li><strong>การจัดอันดับ</strong> จัดอันดับผู้เล่นในโหมดทัวร์นาเมนต์</li>
          <strong className='text-[#E1A6E4]'>***  ฟีเจอร์พิเศษ เมื่อทอยได้ 6 จะได้คะแนน Bonus +1 แต้ม  ***</strong> 
        </ul>
      </section>

      
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#83FFE7] mb-3">เคล็ดลับกลยุทธ์</h2>
        <p className="text-base leading-relaxed">
          เพื่อเพิ่มโอกาสชนะในเกมนี้ ลองใช้กลยุทธ์ต่อไปนี้
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li><strong>เก็บคะแนนอย่างระมัดระวัง:</strong> หากคะแนนปัจจุบันสูง (เช่น 20 หรือมากกว่า) ควรพิจารณากด "Hold Score" เพื่อลดความเสี่ยงจากการทอยได้ 1</li>
          <li><strong>สังเกตคู่ต่อสู้:</strong> ถ้าคู่ต่อสู้ใกล้ถึงเป้าหมาย อาจต้องเสี่ยงทอยมากขึ้นเพื่อตามให้ทัน</li>
          <li><strong>โหมด AI:</strong> ในโหมด AI ระดับยาก AI จะวิเคราะห์สถานการณ์อย่างชาญฉลาด ดังนั้นพยายามคาดเดาการตัดสินใจของ AI และปรับกลยุทธ์ตามนั้น</li>
          <li><strong>โหมดทัวร์นาเมนต์:</strong> ในโหมด Best of 3/5/7 เน้นการเล่นที่สม่ำเสมอเพื่อสะสมชัยชนะในรอบต่างๆ</li>
          <li><strong>จัดการเวลา:</strong> ในโหมดความเร็ว (Speed Mode) ตัดสินใจให้เร็ว</li>
        </ul>
      </section>

      
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#E1A6E4] mb-3">ประวัติการพัฒนาเกม</h2>
        <p className="text-base leading-relaxed">
          เกมนี้ได้รับแรงบันดาลใจจากเกมทอยลูกเต๋า และรูปแบบเกม 2D ใน 8Y.com เว็ปที่รวมเกม 2D ยุค 90 
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li> ระบบพื้นฐาน (ทอยลูกเต๋า, เก็บคะแนน, เปลี่ยนผู้เล่น) และ UI ที่ใช้งานง่าย</li>
          <li>โหมด AI (ง่าย, ปานกลาง, ยาก) และระบบตั้งค่าเป้าหมายคะแนน</li>
          <li>เพิ่มแอนิเมชันลูกเต๋า, เสียงเอฟเฟกต์, และโหมดทัวร์นาเมนต์</li>
          <li> เพิ่มระบบบันทึกประวัติและสถิติ พร้อมฟีเจอร์ส่งออก/นำเข้าข้อมูล</li>
          <li> เพิ่มการปรับแต่งธีม, โหมดความเร็ว, และระบบรางวัล/ความสำเร็จ</li>
        </ul>
      </section>

      
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#83FFE7] mb-3">ข้อมูลผู้พัฒนา</h2>
        <p className="text-base leading-relaxed">
          เกมนี้พัฒนาเพื่อทดสอบ Test Intern ของ บริษัท ดูดี อินดีด คอร์ปอร์ชั่น จำกัด
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li><strong>ผู้พัฒนา:</strong> นาย อารักษ์ คำมุงคุล</li>
          <li><strong>ติดต่อ:</strong> อีเมล arrak26092547@gamil.com </li>
          <li><strong>เป้าหมาย:</strong> ฝึกการใช้ JavaScript การจัดการข้อมูลฝั่งผู้ใช้ การออกแบบ UX/UI และการคิดเชิงระบบ</li>
          <li><strong>ขอบคุณ:</strong> ขอบคุณผู้เล่นทุกคนที่ให้การสนับสนุนและข้อเสนอแนะเพื่อพัฒนาเกมให้ดียิ่งขึ้น!</li>
        </ul>
      </section>

      <div className="text-center">
        <button
          className="px-4 py-2 bg-[#E1A6E4] text-[#1C2126] rounded-md hover:bg-[#83FFE7] transition"
          onClick={() => handleClick()}
        >
          กลับสู่หน้าเกม
        </button>
      </div>
    </div>
  );
};

export default Help;