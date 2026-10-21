import React, { useState } from 'react';
import { FlowerPickerGame } from '../components/games/FlowerPickerGame';
import { LuckyWheelGame } from '../components/games/LuckyWheelGame';
import { KnowledgeArenaGame } from '../components/games/KnowledgeArenaGame';
import { RescueRobotGame } from '../components/games/RescueRobotGame';
import { SmartPairingGame } from '../components/games/SmartPairingGame';
import { LittleExplorerGame } from '../components/games/LittleExplorerGame';
import { soundManager } from '../services/soundEffects';
import { Gamepad2, Award, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GamesCenterPage: React.FC = () => {
  const { student } = useApp();
  const [activeGameId, setActiveGameId] = useState<number>(1);

  const games = [
    {
      id: 1,
      name: 'AI Hái Hoa Tri Thức',
      icon: '🌸',
      tag: 'Ngẫu nhiên',
      color: 'from-pink-500 to-rose-600',
      desc: 'Chọn hoa trong vườn tri thức mở câu hỏi đa môn',
    },
    {
      id: 2,
      name: 'Vòng Quay May Mắn',
      icon: '🎡',
      tag: 'Thử thách',
      color: 'from-amber-500 to-yellow-600',
      desc: 'Quay vòng may mắn nhận nhiệm vụ và điểm thưởng',
    },
    {
      id: 3,
      name: 'AI Đấu Trường Kiến Thức',
      icon: '🏟️',
      tag: '3 Vòng thi',
      color: 'from-indigo-500 to-blue-600',
      desc: 'Khởi động, Tăng tốc tính giờ, Về đích ngôi sao hy vọng',
    },
    {
      id: 4,
      name: 'Giải Cứu Robot AI',
      icon: '⚡',
      tag: 'Chướng ngại vật',
      color: 'from-cyan-500 to-blue-600',
      desc: 'Nạp pin 5 trạm năng lượng vượt thử thách đưa Robot về trường',
    },
    {
      id: 5,
      name: 'Ghép Cặp Thông Minh',
      icon: '🧩',
      tag: 'Tư duy liên kết',
      color: 'from-emerald-500 to-teal-600',
      desc: 'Nối khái niệm toán học, ngữ pháp và khoa học với ý nghĩa',
    },
    {
      id: 6,
      name: 'Nhà Thám Hiểm Nhí',
      icon: '🗺️',
      tag: 'Phiêu lưu 4 miền',
      color: 'from-orange-500 to-red-600',
      desc: 'Bản đồ khám phá Rừng Số Học, Đảo Tiếng Việt, Đỉnh Khoái Châu',
    },
  ];

  const handleSelectGame = (id: number) => {
    soundManager.playClick();
    setActiveGameId(id);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Phân hệ 3 • Học mà chơi – Chơi mà học
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Trung Tâm 6 Trò Chơi Học Tập AI</span>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Lớp 4B
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Không tạo áp lực thứ hạng – Khuyến khích sự tự tin và niềm vui khám phá tri thức của trẻ em!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-amber-800 shadow-2xs">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Điểm tích lũy: {student.points} điểm</span>
        </div>
      </div>

      {/* 6 Game Cards Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {games.map(g => {
          const isSelected = activeGameId === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleSelectGame(g.id)}
              className={`p-3.5 rounded-3xl border text-center transition-all flex flex-col items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-white border-blue-500 ring-2 ring-blue-300 shadow-md scale-105'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${g.color} text-white flex items-center justify-center text-2xl shadow-xs`}
              >
                {g.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800 leading-tight">
                  {g.name}
                </h4>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                  {g.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
        {activeGameId === 1 && <FlowerPickerGame />}
        {activeGameId === 2 && <LuckyWheelGame />}
        {activeGameId === 3 && <KnowledgeArenaGame />}
        {activeGameId === 4 && <RescueRobotGame />}
        {activeGameId === 5 && <SmartPairingGame />}
        {activeGameId === 6 && <LittleExplorerGame />}
      </div>
    </div>
  );
};
