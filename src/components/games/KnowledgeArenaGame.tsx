import React, { useState, useEffect } from 'react';
import { soundManager } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { CURATED_QUESTION_BANK } from '../../data/mockData';
import { Question } from '../../types';
import { Timer, Star, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const KnowledgeArenaGame: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [round, setRound] = useState<'intro' | 1 | 2 | 3 | 'summary'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasHopeStar, setHasHopeStar] = useState(false);
  const [usedHopeStarInRound, setUsedHopeStarInRound] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  // Round 1: 3 basic questions
  // Round 2: 3 acceleration questions with timer
  // Round 3: 1 final question with optional Hope Star (x2)
  const [questions, setQuestions] = useState<Question[]>([]);

  const startArena = () => {
    soundManager.playClick();
    const shuffled = [...CURATED_QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 7)); // 3 for R1, 3 for R2, 1 for R3
    setRound(1);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setHasHopeStar(false);
    setUsedHopeStarInRound(false);
  };

  // Timer for round 2
  useEffect(() => {
    let timer: any = null;
    if (round === 2 && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            soundManager.playIncorrect();
            setIsAnswered(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [round, isAnswered, timeLeft]);

  const currentQ = questions[currentIdx];

  const handleSelectAnswer = (option: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    let earned = 0;

    if (round === 1) {
      earned = isCorrect ? 20 : 0;
    } else if (round === 2) {
      earned = isCorrect ? 30 : 0;
    } else if (round === 3) {
      const base = 40;
      earned = isCorrect ? (usedHopeStarInRound ? base * 2 : base) : (usedHopeStarInRound ? -20 : 0);
    }

    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => Math.max(0, prev + earned));
    } else {
      soundManager.playIncorrect();
      if (round === 3 && usedHopeStarInRound) {
        setScore(prev => Math.max(0, prev + earned));
      }
    }
  };

  const nextQuestion = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setIsAnswered(false);

    if (round === 1) {
      if (currentIdx < 2) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Move to Round 2
        setRound(2);
        setCurrentIdx(3);
        setTimeLeft(20);
      }
    } else if (round === 2) {
      if (currentIdx < 5) {
        setCurrentIdx(prev => prev + 1);
        setTimeLeft(20);
      } else {
        // Move to Round 3
        setRound(3);
        setCurrentIdx(6);
      }
    } else if (round === 3) {
      triggerCelebration();
      setRound('summary');
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50/70 via-blue-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-indigo-200/60 shadow-sm min-h-[480px]">
      {/* Intro Screen */}
      {round === 'intro' && (
        <div className="text-center py-6 max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏟️
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            AI Đấu Trường Kiến Thức Lớp 4
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Chào mừng bạn đến với đấu trường trí tuệ! Vượt qua 3 chặng thi hào hứng để chinh phục danh hiệu Chiến Binh Tri Thức!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
            <div className="p-3 bg-white rounded-xl border border-sky-200">
              <span className="font-bold text-sky-700 block">Vòng 1: Khởi Động</span>
              <span className="text-slate-500">3 câu cơ bản nhận biết (+20đ/câu)</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <span className="font-bold text-amber-700 block">Vòng 2: Tăng Tốc</span>
              <span className="text-slate-500">3 câu tính giờ 20 giây (+30đ/câu)</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-purple-200">
              <span className="font-bold text-purple-700 block">Vòng 3: Về Đích</span>
              <span className="text-slate-500">1 câu Vận dụng cao + Ngôi sao hy vọng</span>
            </div>
          </div>
          <button
            onClick={startArena}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 text-base"
          >
            VÀO ĐẤU TRƯỜNG NGAY
          </button>
        </div>
      )}

      {/* Rounds Screen */}
      {typeof round === 'number' && currentQ && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Top Status */}
          <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-xl">
                {round === 1 ? 'VÒNG 1: KHỞI ĐỘNG' : round === 2 ? 'VÒNG 2: TĂNG TỐC' : 'VÒNG 3: VỀ ĐÍCH'}
              </span>
              <span className="text-xs text-slate-500">
                Câu {round === 1 ? currentIdx + 1 : round === 2 ? currentIdx - 2 : 1}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {round === 2 && (
                <div className={`flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg ${
                  timeLeft <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-800'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl text-sm">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{score} điểm</span>
              </div>
            </div>
          </div>

          {/* Hope star option in Round 3 */}
          {round === 3 && !isAnswered && (
            <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${usedHopeStarInRound ? 'text-amber-500 fill-amber-500' : 'text-purple-400'}`} />
                <div className="text-xs">
                  <span className="font-bold text-purple-900 block">Ngôi Sao Hy Vọng (x2 Điểm)</span>
                  <span className="text-purple-700 text-[11px]">Đúng được +80 điểm, sai bị trừ 20 điểm.</span>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setUsedHopeStarInRound(!usedHopeStarInRound);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  usedHopeStarInRound
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border border-purple-300 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {usedHopeStarInRound ? 'Đang bật ⭐' : 'Bật Ngôi Sao'}
              </button>
            </div>
          )}

          {/* Question Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {currentQ.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                let style = 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-700';

                if (isAnswered) {
                  if (isCorrect) {
                    style = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    style = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                  } else {
                    style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(opt)}
                    className={`p-3.5 rounded-xl border text-sm text-left font-medium transition-all ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-indigo-50/70 border border-indigo-100 p-3.5 rounded-xl text-xs text-indigo-950 space-y-1">
                <p className="font-bold">💡 Phản hồi sư phạm:</p>
                <p>{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {isAnswered && (
            <div className="text-center pt-2">
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all text-sm"
              >
                {round === 3 ? 'Xem kết quả tổng kết' : 'Câu tiếp theo ➜'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Screen */}
      {round === 'summary' && (
        <div className="text-center py-6 max-w-md mx-auto space-y-5">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
            🥇
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Chiến Binh Đấu Trường Kiến Thức!
          </h3>
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng điểm chung cuộc</p>
            <p className="text-4xl font-black text-indigo-700">{score} điểm</p>
            <p className="text-xs text-slate-600">
              Bạn đã hoàn thành xuất sắc cả 3 vòng thi Đấu Trường. Điểm số đã được ghi nhận vào hồ sơ cá nhân!
            </p>
          </div>
          <button
            onClick={startArena}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tham gia lượt thi mới</span>
          </button>
        </div>
      )}
    </div>
  );
};
