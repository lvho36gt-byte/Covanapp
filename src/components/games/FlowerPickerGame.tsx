import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../services/soundEffects';
import { Sparkles, RotateCcw, CheckCircle2, XCircle, Award } from 'lucide-react';
import { CURATED_QUESTION_BANK } from '../../data/mockData';
import { Question } from '../../types';

export const FlowerPickerGame: React.FC = () => {
  const { student, triggerCelebration } = useApp();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'question' | 'summary'>('intro');
  const [flowers, setFlowers] = useState<Array<{ id: number; color: string; isPicked: boolean; question: Question }>>([]);
  const [activeFlower, setActiveFlower] = useState<{ id: number; question: Question } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const flowerColors = [
    'from-pink-400 to-rose-500',
    'from-amber-400 to-yellow-500',
    'from-sky-400 to-blue-500',
    'from-emerald-400 to-teal-500',
    'from-purple-400 to-violet-500',
    'from-orange-400 to-red-500',
  ];

  const startGame = () => {
    soundManager.playClick();
    // Pick 6 random questions from bank
    const shuffled = [...CURATED_QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 6);
    const newFlowers = shuffled.map((q, idx) => ({
      id: idx + 1,
      color: flowerColors[idx % flowerColors.length],
      isPicked: false,
      question: q,
    }));
    setFlowers(newFlowers);
    setScore(0);
    setGameState('playing');
  };

  const pickFlower = (flower: { id: number; color: string; isPicked: boolean; question: Question }) => {
    if (flower.isPicked) return;
    soundManager.playClick();
    setActiveFlower({ id: flower.id, question: flower.question });
    setSelectedOption(null);
    setIsAnswered(false);
    setGameState('question');
  };

  const submitAnswer = (option: string) => {
    if (isAnswered || !activeFlower) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === activeFlower.question.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 20);
      // Mark flower as picked
      setFlowers(prev => prev.map(f => f.id === activeFlower.id ? { ...f, isPicked: true } : f));
    } else {
      soundManager.playIncorrect();
    }
  };

  const continueGame = () => {
    soundManager.playClick();
    // Check if all flowers picked or attempted
    const remaining = flowers.filter(f => !f.isPicked && f.id !== activeFlower?.id);
    if (remaining.length === 0) {
      triggerCelebration();
      setGameState('summary');
    } else {
      setGameState('playing');
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 via-teal-50/40 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm min-h-[480px] flex flex-col justify-between">
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="text-center py-6 max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
            🌸
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            AI Hái Hoa Tri Thức
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Trong vườn hoa trí tuệ Khoái Châu 1, mỗi bông hoa rực rỡ đều ẩn chứa một câu hỏi thú vị. 
            Em hãy chọn từng bông hoa, suy nghĩ cẩn thận và trả lời để thu hoạch giỏ hoa tri thức nhé!
          </p>
          <div className="bg-white/80 p-4 rounded-2xl border border-sky-200 text-xs text-slate-700 text-left space-y-1.5">
            <p className="font-bold text-sky-800">🌟 Quy tắc trò chơi:</p>
            <p>• Có 6 bông hoa ngẫu nhiên thuộc môn Toán, Tiếng Việt, Khoa học.</p>
            <p>• Mỗi câu trả lời đúng được cộng <strong>20 điểm</strong> học tập.</p>
            <p>• Robot Bạn Học sẽ giải thích chi tiết sau mỗi câu trả lời.</p>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-200 transition-transform active:scale-95 text-base"
          >
            BẮT ĐẦU HÁI HOA
          </button>
        </div>
      )}

      {/* Playing Screen - Flower Field */}
      {gameState === 'playing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-sky-200/60 pb-3">
            <div>
              <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span>Vườn hoa tri thức Khoái Châu</span>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                  Đã hái: {flowers.filter(f => f.isPicked).length}/6
                </span>
              </h4>
              <p className="text-xs text-slate-500">Chạm vào bông hoa còn nở để mở câu hỏi thử thách!</p>
            </div>
            <div className="flex items-center gap-1.5 font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-xl text-sm">
              <Award className="w-4 h-4" />
              <span>{score} điểm</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 py-4">
            {flowers.map(flower => (
              <div
                key={flower.id}
                onClick={() => pickFlower(flower)}
                className={`p-6 rounded-3xl text-center border transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-2 ${
                  flower.isPicked
                    ? 'bg-slate-100 border-slate-200 opacity-60 cursor-default scale-95'
                    : 'bg-white hover:border-sky-300 shadow-md hover:shadow-lg hover:-translate-y-1.5 active:scale-95'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${flower.color} flex items-center justify-center text-3xl shadow-md transition-transform ${
                    flower.isPicked ? 'grayscale' : 'animate-wiggle'
                  }`}
                >
                  {flower.isPicked ? '🧺' : '🌸'}
                </div>
                <span className="font-bold text-xs text-slate-700">
                  {flower.isPicked ? 'Đã thu hoạch' : `Bông hoa số ${flower.id}`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {flower.question.subjectId === 'math' ? 'Toán' : flower.question.subjectId === 'vietnamese' ? 'Tiếng Việt' : 'Khoa học'}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                triggerCelebration();
                setGameState('summary');
              }}
              className="text-xs text-slate-500 hover:text-blue-600 underline font-semibold"
            >
              Kết thúc sớm và xem điểm
            </button>
          </div>
        </div>
      )}

      {/* Question Screen */}
      {gameState === 'question' && activeFlower && (
        <div className="space-y-5 max-w-2xl mx-auto py-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-lg">
              Bông hoa số {activeFlower.id} • {activeFlower.question.cognitiveLevel}
            </span>
            <span className="font-semibold text-amber-600">Đúng: +20 điểm</span>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {activeFlower.question.question}
            </h4>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeFlower.question.options?.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === activeFlower.question.correctAnswer;
                
                let btnStyle = 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-700';
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
                    key={i}
                    disabled={isAnswered}
                    onClick={() => submitAnswer(opt)}
                    className={`p-3.5 rounded-xl border text-sm text-left font-medium transition-all flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-white/80 border flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 animate-fadeIn ${
                selectedOption === activeFlower.question.correctAnswer
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {selectedOption === activeFlower.question.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Chính xác tuyệt vời! +20 điểm</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Chưa đúng rồi! Em hãy đọc gợi ý của Robot Bạn Học nhé:</span>
                    </>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed">
                  💡 <strong>Giải thích:</strong> {activeFlower.question.explanation}
                </p>
              </div>
            )}
          </div>

          {isAnswered && (
            <div className="text-center">
              <button
                onClick={continueGame}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                Tiếp tục hái hoa 🌸
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Screen */}
      {gameState === 'summary' && (
        <div className="text-center py-6 max-w-md mx-auto space-y-5">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Tổng kết Hái Hoa Tri Thức!
          </h3>
          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Điểm đạt được</p>
            <p className="text-4xl font-black text-blue-700">{score} điểm</p>
            <p className="text-xs text-slate-600">
              {score >= 80 ? '🌟 Tuyệt vời! Bạn là tay hái hoa thông thái số 1 lớp 4B!' : '👏 Hoan hô bạn đã nỗ lực hết mình! Luyện tập thêm để đạt điểm tuyệt đối nhé!'}
            </p>
          </div>
          <button
            onClick={startGame}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại vườn hoa mới</span>
          </button>
        </div>
      )}
    </div>
  );
};
