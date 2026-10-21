import React, { useState } from 'react';
import { soundManager } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { CURATED_QUESTION_BANK } from '../../data/mockData';
import { Question } from '../../types';
import { MapPin, Compass, Award, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react';

interface Zone {
  id: number;
  name: string;
  badge: string;
  bgGradient: string;
  icon: string;
  subjectId: string;
  taskTitle: string;
}

export const LittleExplorerGame: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [gameState, setGameState] = useState<'intro' | 'exploring' | 'treasure'>('intro');
  const [currentZoneIdx, setCurrentZoneIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const zones: Zone[] = [
    {
      id: 1,
      name: 'Rừng Số Học',
      badge: 'Chặng 1',
      bgGradient: 'from-blue-500 to-indigo-600',
      icon: '🌲',
      subjectId: 'math',
      taskTitle: 'Giải mật mã số tự nhiên để mở cổng rừng',
    },
    {
      id: 2,
      name: 'Đảo Tiếng Việt',
      badge: 'Chặng 2',
      bgGradient: 'from-amber-500 to-orange-600',
      icon: '🏝️',
      subjectId: 'vietnamese',
      taskTitle: 'Tìm từ ngữ chính xác để bắc cầu qua vịnh',
    },
    {
      id: 3,
      name: 'Thung Lũng Khoa Học',
      badge: 'Chặng 3',
      bgGradient: 'from-emerald-500 to-teal-600',
      icon: '🏔️',
      subjectId: 'science',
      taskTitle: 'Giải thích hiện tượng thiên nhiên để giải độc dòng suối',
    },
    {
      id: 4,
      name: 'Đỉnh Núi Khoái Châu',
      badge: 'Chặng 4 - Đích',
      bgGradient: 'from-rose-500 to-purple-600',
      icon: '🏰',
      subjectId: 'history_geo',
      taskTitle: 'Thử thách lịch sử địa phương Chử Đồng Tử mở rương kho báu',
    },
  ];

  // Pick questions matching zone subjects
  const getZoneQuestion = (zoneIdx: number): Question => {
    const targetSubject = zones[zoneIdx].subjectId;
    const match = CURATED_QUESTION_BANK.find(q => q.subjectId === targetSubject);
    return match || CURATED_QUESTION_BANK[0];
  };

  const startJourney = () => {
    soundManager.playClick();
    setCurrentZoneIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameState('exploring');
  };

  const currentZone = zones[currentZoneIdx];
  const currentQ = getZoneQuestion(currentZoneIdx);

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      soundManager.playCorrect();
      setScore(prev => prev + 30);
    } else {
      soundManager.playIncorrect();
    }
  };

  const advanceZone = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentZoneIdx + 1 < zones.length) {
      setCurrentZoneIdx(prev => prev + 1);
    } else {
      triggerCelebration();
      setGameState('treasure');
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/70 via-sky-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-sm min-h-[480px]">
      {/* Intro */}
      {gameState === 'intro' && (
        <div className="text-center py-6 max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
            🗺️
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Nhà Thám Hiểm Nhí
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cùng mở tấm bản đồ thám hiểm và vượt qua 4 miền đất kỳ thú: Rừng Số Học ➜ Đảo Tiếng Việt ➜ Thung Lũng Khoa Học ➜ Đỉnh Núi Khoái Châu. 
            Mở rương kho báu tri thức đang chờ đón bạn ở đỉnh vinh quang!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            {zones.map((z, idx) => (
              <div key={z.id} className="p-3 bg-white rounded-xl border border-amber-200">
                <span className="text-2xl block mb-1">{z.icon}</span>
                <span className="font-bold text-slate-800">{z.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={startJourney}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-95 text-base"
          >
            LÊN ĐƯỜNG KHÁM PHÁ
          </button>
        </div>
      )}

      {/* Exploring */}
      {gameState === 'exploring' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Map Journey Track */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-800 flex items-center gap-1">
                <Compass className="w-4 h-4 text-amber-500 animate-spin" />
                Vùng đất: {currentZone.name}
              </span>
              <span className="text-slate-500">
                Chặng {currentZoneIdx + 1} / {zones.length}
              </span>
              <span className="text-amber-600">
                Điểm: {score}đ
              </span>
            </div>

            {/* Stepper with icons */}
            <div className="grid grid-cols-4 gap-2">
              {zones.map((z, idx) => {
                const isPassed = idx < currentZoneIdx;
                const isCurrent = idx === currentZoneIdx;
                return (
                  <div
                    key={z.id}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isPassed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isCurrent
                        ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300 font-bold scale-[1.02]'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-xl block">{z.icon}</span>
                    <span className="text-[11px] font-bold block truncate">{z.name}</span>
                    <span className="text-[9px] uppercase tracking-wider block">
                      {isPassed ? '✓ Đã qua' : isCurrent ? 'Đang ở đây' : 'Chưa đến'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mission Challenge */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-lg">
                Thử thách: {currentZone.taskTitle}
              </span>
              <span className="text-amber-600 font-bold">+30 điểm</span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {currentQ.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
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
                    className={`p-3.5 rounded-xl border text-sm text-left font-medium transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-950 space-y-1">
                <p className="font-bold">🧭 La bàn chỉ dẫn:</p>
                <p>{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {isAnswered && (
            <div className="text-center pt-2">
              <button
                onClick={advanceZone}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md transition-all text-sm"
              >
                <span>{currentZoneIdx + 1 >= zones.length ? 'Mở Rương Kho Báu!' : 'Tiến tới vùng đất mới'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Treasure */}
      {gameState === 'treasure' && (
        <div className="text-center py-6 max-w-md mx-auto space-y-5">
          <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-inner animate-bounce">
            👑
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Rương Kho Báu Tri Thức Đã Mở!
          </h3>
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng điểm thám hiểm</p>
            <p className="text-4xl font-black text-amber-600">{score} điểm</p>
            <p className="text-xs text-slate-600">
              Chúc mừng bạn đã chinh phục trọn vẹn bản đồ 4 vùng đất tri thức! Bạn chính là Nhà Thám Hiểm xuất sắc của lớp 4B!
            </p>
          </div>
          <button
            onClick={startJourney}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thực hiện chuyến thám hiểm mới</span>
          </button>
        </div>
      )}
    </div>
  );
};
