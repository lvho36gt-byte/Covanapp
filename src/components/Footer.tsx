import React from 'react';
import { ShieldCheck, Heart, Sparkles, School } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-8 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span className="text-xl font-black text-white tracking-tight">
                AI ĐỒNG HÀNH – LỚP 4B
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              "Lấy học sinh làm trung tâm – AI đồng hành khơi mở tiềm năng của mỗi em!" 
              Hệ thống học tập thông minh cá nhân hóa, phát triển năng lực và phẩm chất cho học sinh Lớp 4 theo Chương trình GDPT 2018.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold pt-1">
              <School className="w-4 h-4" />
              <span>Trường Tiểu học Khoái Châu 1 • Huyện Khoái Châu • Năm học 2026</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-blue-400">
              Phân hệ chính
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><button onClick={() => onNavigate('learning')} className="hover:text-white transition-colors">Góc học tập thông minh</button></li>
              <li><button onClick={() => onNavigate('robot-tutor')} className="hover:text-white transition-colors">Robot Bạn Học AI (Chatbot)</button></li>
              <li><button onClick={() => onNavigate('games')} className="hover:text-white transition-colors">6 Trò chơi học tập tương tác</button></li>
              <li><button onClick={() => onNavigate('creative')} className="hover:text-white transition-colors">Góc sáng tạo của em</button></li>
              <li><button onClick={() => onNavigate('progress')} className="hover:text-white transition-colors">Theo dõi tiến bộ học sinh</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase text-teal-400">
              Thông tin & An toàn
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Giáo viên thực hiện: <strong className="text-white font-semibold">Nguyễn Thị Cẩm Vân</strong>
            </p>
            <div className="flex items-start gap-1.5 text-[11px] text-emerald-400 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Cam kết an toàn AI cho trẻ em: Không lưu thông tin nhạy cảm, nội dung giáo viên thẩm định 100%.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-1">
            <span>Thiết kế dành tặng các em học sinh Lớp 4B thân yêu</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </div>
          <div>
            <span>© 2026 AI ĐỒNG HÀNH. Phiên bản giáo dục GDPT 2018.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
