import React, { useState } from 'react';
import { soundManager } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { RobotMascot } from '../RobotMascot';
import { CURATED_QUESTION_BANK } from '../../data/mockData';
import { Question } from '../../types';
import { BatteryCharging, ShieldAlert, Award, RotateCcw, Check, Sparkles } from 'lucide-react';

export const RescueRobotGame: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [stage, setStage] = useState<'intro' | 'playing' | 'rescued'>('intro');
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5 steps
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const totalSteps = 5;

  const startGame = () => {
    soundManager.playClick();
    const shuffled = [...CURATED_QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, totalSteps));
    setCurrentStep(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setStage('playing');
  };

  const currentQ = questions[currentStep];

  const handleSelectAnswer = (option: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      soundManager.playCorrect();
      setScore(prev => prev + 25);
    } else {
      soundManager.playIncorrect();
    }
  };

  const proceedNextStep = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentStep + 1 >= totalSteps) {
      triggerCelebration();
      setStage('rescued');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="bg-gradient-to-b from-cyan-50/70 via-blue-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-cyan-200 shadow-sm min-h-[480px]">
      {/* Intro */}
      {stage === 'intro' && (
        <div className="text-center py-6 max-w-xl mx-auto space-y-5">
          <RobotMascot size="lg" expression="thinking" showBubble bubbleText="Cứu tớ với bạn ơi!" />
          <h3 className="text-2xl font-black text-slate-800">
            Giải Cứu Robot AI
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ôi không! Robot Bạn Học bị cạn pin và kẹt lại giữa 5 trạm chướng ngại vật trên Hành Tinh Số. 
            Mỗi câu trả lời đúng của bạn sẽ nạp 20% năng lượng và dọn sạch 1 chướng ngại vật để đưa Robot về trường Khoái Châu 1 an toàn!
          </p>
          <div className="bg-white p-4 rounded-2xl border border-cyan-200 text-xs text-slate-700 text-left space-y-1">
            <p className="font-bold text-cyan-800">⚡ Nhiệm vụ giải cứu:</p>
            <p>• Trải qua 5 trạm năng lượng với các câu hỏi tư duy lớp 4.</p>
            <p>• Sạc đầy 100% pin để kích hoạt phi thuyền đưa Robot trở về!</p>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black rounded-2xl shadow-lg shadow-cyan-200 transition-all active:scale-95 text-base"
          >
            BẮT ĐẦU GIẢI CỨU
          </button>
        </div>
      )}

      {/* Playing */}
      {stage === 'playing' && currentQ && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Progress & Energy Bar */}
          <div className="bg-white p-4 rounded-2xl border border-cyan-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-cyan-700">
                <BatteryCharging className="w-4 h-4 text-cyan-500 animate-pulse" />
                Năng lượng Robot: {currentStep * 20}%
              </span>
              <span className="text-slate-500">
                Trạm {currentStep + 1} / {totalSteps}
              </span>
              <span className="text-amber-600">
                Điểm: {score}đ
              </span>
            </div>

            {/* Visual Step Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Stepper icons */}
            <div className="flex justify-between items-center text-xs pt-1 px-1">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-[11px] transition-all ${
                    step <= currentStep
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : step === currentStep + 1
                      ? 'bg-cyan-500 text-white animate-bounce shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step <= currentStep ? '✓' : step}
                </div>
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-cyan-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="bg-cyan-100 text-cyan-800 font-bold px-2.5 py-0.5 rounded-lg">
                Chướng ngại vật {currentStep + 1} • {currentQ.subjectId === 'math' ? 'Toán' : currentQ.subjectId === 'vietnamese' ? 'Tiếng Việt' : 'Khoa học'}
              </span>
              <span className="text-amber-600 font-semibold">+25 điểm</span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {currentQ.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                let btnStyle = 'bg-slate-50 hover:bg-cyan-50 border-slate-200 text-slate-700';

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
                    onClick={() => handleSelectAnswer(opt)}
                    className={`p-3.5 rounded-xl border text-sm text-left font-medium transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-cyan-50 border border-cyan-200 p-3.5 rounded-xl text-xs text-cyan-950 space-y-1">
                <p className="font-bold">⚡ Pin nạp thêm! Lời khuyên của Robot:</p>
                <p>{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {isAnswered && (
            <div className="text-center pt-2">
              <button
                onClick={proceedNextStep}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-md transition-all text-sm"
              >
                {currentStep + 1 >= totalSteps ? 'Giải cứu Robot thành công!' : 'Vượt trạm tiếp theo ➜'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rescued */}
      {stage === 'rescued' && (
        <div className="text-center py-6 max-w-md mx-auto space-y-5">
          <RobotMascot size="lg" expression="celebrating" showBubble bubbleText="Cảm ơn bạn! Tớ đã về lớp 4B rồi!" />
          <h3 className="text-2xl font-black text-slate-800">
            Giải Cứu Thành Công 100%!
          </h3>
          <div className="bg-white p-5 rounded-2xl border border-cyan-200 shadow-sm space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Điểm giải cứu tích lũy</p>
            <p className="text-4xl font-black text-cyan-700">{score} điểm</p>
            <p className="text-xs text-slate-600">
              Robot Bạn Học đã được nạp đầy 100% năng lượng và sẵn sàng cùng bạn khám phá những bài học tiếp theo!
            </p>
          </div>
          <button
            onClick={startGame}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại chuyến phiêu lưu</span>
          </button>
        </div>
      )}
    </div>
  );
};
