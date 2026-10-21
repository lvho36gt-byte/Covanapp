import React, { useState } from 'react';
import { soundManager } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { Award, RotateCcw, Check, Sparkles } from 'lucide-react';

interface PairItem {
  id: string;
  leftText: string;
  rightText: string;
}

export const SmartPairingGame: React.FC = () => {
  const { triggerCelebration } = useApp();
  const [stage, setStage] = useState<'intro' | 'playing' | 'completed'>('intro');

  const samplePairSets: PairItem[][] = [
    [
      { id: 'p1', leftText: 'Góc vuông', rightText: 'Góc có số đo đúng bằng 90°' },
      { id: 'p2', leftText: 'Góc nhọn', rightText: 'Góc bé hơn góc vuông (< 90°)' },
      { id: 'p3', leftText: 'Góc tù', rightText: 'Góc lớn hơn góc vuông (> 90°)' },
      { id: 'p4', leftText: '1 thế kỉ', rightText: 'Bằng đúng 100 năm' },
      { id: 'p5', leftText: '1 tấn', rightText: 'Bằng 1 000 ki-lô-gam' },
    ],
    [
      { id: 'p6', leftText: 'Từ đồng nghĩa', rightText: 'Các từ có nghĩa giống hoặc gần giống nhau' },
      { id: 'p7', leftText: 'Danh từ', rightText: 'Từ chỉ sự vật (người, vật, hiện tượng)' },
      { id: 'p8', leftText: 'Động từ', rightText: 'Từ chỉ hoạt động hoặc trạng thái' },
      { id: 'p9', leftText: 'Tính từ', rightText: 'Từ chỉ đặc điểm, tính chất, màu sắc' },
    ],
    [
      { id: 'p10', leftText: 'Nước đá (Băng tuyết)', rightText: 'Thể rắn của nước' },
      { id: 'p11', leftText: 'Hơi nước bốc lên', rightText: 'Thể khí của nước' },
      { id: 'p12', leftText: 'Sự ngưng tụ', rightText: 'Hơi nước gặp lạnh đọng thành giọt' },
      { id: 'p13', leftText: 'Mây gặp lạnh nặng hạt', rightText: 'Rơi xuống tạo thành mưa' },
    ],
  ];

  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [leftItems, setLeftItems] = useState<Array<{ id: string; text: string }>>([]);
  const [rightItems, setRightItems] = useState<Array<{ id: string; text: string }>>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const startLevel = (idx: number) => {
    soundManager.playClick();
    const pairs = samplePairSets[idx];
    const lefts = pairs.map(p => ({ id: p.id, text: p.leftText }));
    // Shuffle right items
    const rights = [...pairs]
      .sort(() => 0.5 - Math.random())
      .map(p => ({ id: p.id, text: p.rightText }));

    setLeftItems(lefts);
    setRightItems(rights);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setCurrentSetIdx(idx);
    setStage('playing');
  };

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundManager.playClick();
    setSelectedLeft(id);

    // If right already selected, verify match
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundManager.playClick();
    setSelectedRight(id);

    // If left already selected, verify match
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct match!
      soundManager.playCorrect();
      const newMatched = [...matchedIds, leftId];
      setMatchedIds(newMatched);
      setScore(prev => prev + 20);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if finished current set
      if (newMatched.length === leftItems.length) {
        if (currentSetIdx + 1 < samplePairSets.length) {
          setTimeout(() => {
            startLevel(currentSetIdx + 1);
          }, 800);
        } else {
          triggerCelebration();
          setStage('completed');
        }
      }
    } else {
      // Wrong match
      soundManager.playIncorrect();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50/70 via-teal-50/50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-sm min-h-[480px]">
      {/* Intro */}
      {stage === 'intro' && (
        <div className="text-center py-6 max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
            🧩
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Ghép Cặp Thông Minh
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Rèn luyện tư duy liên kết và củng cố khái niệm! Bạn hãy ghép nối chính xác giữa các thuật ngữ toán học, 
            ngữ pháp tiếng Việt hoặc hiện tượng khoa học với ý nghĩa tương ứng nhé!
          </p>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs text-slate-700 text-left space-y-1">
            <p className="font-bold text-emerald-800">🎯 Cách chơi rất đơn giản:</p>
            <p>1. Nhấp chọn một thẻ ở Cột Trái (Khái niệm).</p>
            <p>2. Nhấp chọn một thẻ ở Cột Phải (Ý nghĩa khớp nhau).</p>
            <p>3. Ghép đúng sẽ phát sáng xanh lá và cộng 20 điểm!</p>
          </div>
          <button
            onClick={() => startLevel(0)}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-base"
          >
            BẮT ĐẦU GHÉP CẶP
          </button>
        </div>
      )}

      {/* Playing */}
      {stage === 'playing' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <div>
              <h4 className="font-bold text-slate-800 text-base">
                Chủ đề {currentSetIdx + 1} / {samplePairSets.length}: {currentSetIdx === 0 ? 'Toán học' : currentSetIdx === 1 ? 'Tiếng Việt' : 'Khoa học'}
              </h4>
              <p className="text-xs text-slate-500">Đã ghép: {matchedIds.length} / {leftItems.length} cặp</p>
            </div>
            <div className="flex items-center gap-1.5 font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl text-sm">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{score} điểm</span>
            </div>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                Khái niệm / Thuật ngữ
              </span>
              {leftItems.map(item => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedLeft === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleLeftClick(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-sm font-bold text-left transition-all flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-80 cursor-default'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 shadow-md scale-[1.02]'
                        : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-700 shadow-xs'
                    }`}
                  >
                    <span>{item.text}</span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                Ý nghĩa / Định nghĩa
              </span>
              {rightItems.map(item => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedRight === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleRightClick(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-medium text-left transition-all flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-80 cursor-default'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 shadow-md scale-[1.02]'
                        : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-700 shadow-xs'
                    }`}
                  >
                    <span>{item.text}</span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Completed */}
      {stage === 'completed' && (
        <div className="text-center py-6 max-w-md mx-auto space-y-5">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
            🎉
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            Hoàn Thành Ghép Cặp Thông Minh!
          </h3>
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng điểm ghi nhận</p>
            <p className="text-4xl font-black text-emerald-600">{score} điểm</p>
            <p className="text-xs text-slate-600">
              Bạn có trí nhớ và khả năng liên kết kiến thức cực kỳ sắc bén! Hãy tiếp tục phát huy nhé!
            </p>
          </div>
          <button
            onClick={() => startLevel(0)}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại từ đầu</span>
          </button>
        </div>
      )}
    </div>
  );
};
