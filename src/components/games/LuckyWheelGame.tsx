import React, { useState, useRef } from 'react';
import { soundManager } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { Sparkles, RotateCw, CheckCircle2, Award } from 'lucide-react';
import { CURATED_QUESTION_BANK } from '../../data/mockData';
import { Question } from '../../types';

interface WheelSector {
  label: string;
  color: string;
  textColor: string;
  subjectId: string;
}

export const LuckyWheelGame: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeSector, setActiveSector] = useState<WheelSector | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const sectors: WheelSector[] = [
    { label: 'Toán học 🔢', color: '#3B82F6', textColor: '#FFFFFF', subjectId: 'math' },
    { label: 'Tiếng Việt 📚', color: '#F59E0B', textColor: '#FFFFFF', subjectId: 'vietnamese' },
    { label: 'Khoa học 🔬', color: '#10B981', textColor: '#FFFFFF', subjectId: 'science' },
    { label: 'Lịch sử Địa lí 🧭', color: '#EC4899', textColor: '#FFFFFF', subjectId: 'history_geo' },
    { label: 'Tin học 💻', color: '#06B6D4', textColor: '#FFFFFF', subjectId: 'informatics' },
    { label: 'Thưởng 20đ 🎁', color: '#8B5CF6', textColor: '#FFFFFF', subjectId: 'bonus' },
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    soundManager.playClick();
    setIsSpinning(true);
    setActiveSector(null);
    setActiveQuestion(null);
    setSelectedOption(null);
    setIsAnswered(false);

    // Random rotations between 5 and 9 full turns + random sector offset
    const randomSectorIdx = Math.floor(Math.random() * sectors.length);
    const sectorAngle = 360 / sectors.length;
    // Align sector to pointer (top = 270 deg or 0 deg depending on arrow)
    const targetAngle = 360 * 6 + (sectors.length - randomSectorIdx) * sectorAngle - sectorAngle / 2;
    const finalRotation = rotation + targetAngle;

    setRotation(finalRotation);

    // Play tick sounds periodically
    let tickCount = 0;
    const interval = setInterval(() => {
      soundManager.playWheelTick();
      tickCount++;
      if (tickCount > 18) clearInterval(interval);
    }, 150);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinCount(prev => prev + 1);
      const chosen = sectors[randomSectorIdx];
      setActiveSector(chosen);

      if (chosen.subjectId === 'bonus') {
        soundManager.playCorrect();
        triggerCelebration();
        setScore(prev => prev + 20);
      } else {
        // Pick question for chosen subject
        const matches = CURATED_QUESTION_BANK.filter(q => q.subjectId === chosen.subjectId);
        const q = matches.length > 0 ? matches[Math.floor(Math.random() * matches.length)] : CURATED_QUESTION_BANK[0];
        setActiveQuestion(q);
      }
    }, 3500);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered || !activeQuestion) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === activeQuestion.correctAnswer) {
      soundManager.playCorrect();
      setScore(prev => prev + 25);
    } else {
      soundManager.playIncorrect();
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/70 via-sky-50/50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-sm min-h-[480px]">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🎡 Vòng Quay May Mắn</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Lượt quay: {spinCount}
              </span>
            </h3>
            <p className="text-xs text-slate-500">Quay vòng để mở thử thách bất ngờ theo chủ đề học tập!</p>
          </div>
          <div className="flex items-center gap-1.5 font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl text-sm">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{score} điểm</span>
          </div>
        </div>

        {/* Wheel Display */}
        <div className="flex flex-col items-center justify-center relative py-4">
          {/* Arrow Pointer */}
          <div className="absolute top-0 z-20 -mt-2">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-red-500 drop-shadow-md"></div>
          </div>

          {/* SVG Rotating Wheel */}
          <div
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-white shadow-xl transition-all duration-[3500ms] ease-out select-none"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full rounded-full">
              {sectors.map((sec, i) => {
                const angle = 360 / sectors.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                
                // SVG arc path
                const x1 = 100 + 98 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 100 + 98 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 100 + 98 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 100 + 98 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const textAngle = startAngle + angle / 2 - 90;
                const textX = 100 + 60 * Math.cos((Math.PI * textAngle) / 180);
                const textY = 100 + 60 * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={i}>
                    <path
                      d={`M100 100 L${x1} ${y1} A98 98 0 0 1 ${x2} ${y2} Z`}
                      fill={sec.color}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={sec.textColor}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {sec.label}
                    </text>
                  </g>
                );
              })}
              {/* Center Pin */}
              <circle cx="100" cy="100" r="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
              <circle cx="100" cy="100" r="8" fill="#F59E0B" />
            </svg>
          </div>

          {/* Spin Button */}
          <div className="mt-6">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-2xl shadow-lg shadow-amber-200 transition-all text-base ${
                isSpinning ? 'opacity-60 cursor-not-allowed scale-95' : 'active:scale-95'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY!'}</span>
            </button>
          </div>
        </div>

        {/* Bonus Result */}
        {activeSector && activeSector.subjectId === 'bonus' && (
          <div className="bg-purple-100 border border-purple-300 p-5 rounded-2xl text-center space-y-2 animate-bounce">
            <span className="text-3xl">🎉</span>
            <h4 className="font-black text-purple-900 text-lg">Chúc mừng bạn trúng ô Thưởng Điểm!</h4>
            <p className="text-xs text-purple-700">Robot Bạn Học tặng ngay <strong>+20 điểm</strong> học tập!</p>
          </div>
        )}

        {/* Question Challenge from wheel */}
        {activeQuestion && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-lg">
                Thử thách môn: {activeSector?.label}
              </span>
              <span className="text-amber-600 font-bold">Đúng: +25 điểm</span>
            </div>

            <h4 className="text-base font-bold text-slate-800">
              {activeQuestion.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeQuestion.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === activeQuestion.correctAnswer;
                let btnStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-700';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm text-left font-medium transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-900 space-y-1">
                <p className="font-bold">💡 Giải thích của Robot:</p>
                <p>{activeQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
