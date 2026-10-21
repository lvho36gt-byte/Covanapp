import React from 'react';
import { useApp } from '../context/AppContext';
import { RobotMascot } from '../components/RobotMascot';
import { SUBJECTS, BADGES } from '../data/mockData';
import { 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  Bot, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Heart, 
  Users, 
  Layers,
  Star,
  Flame
} from 'lucide-react';

export const HomePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { student, quizAttempts, currentRole } = useApp();

  const fourPillars = [
    {
      title: 'Học tập cá nhân hóa',
      desc: 'Hệ thống tự động phân tích và điều chỉnh độ khó theo 4 mức độ nhận thức, giúp mỗi học sinh tiến bộ theo năng lực riêng.',
      icon: '🎯',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      title: 'Học mà chơi – Chơi mà học',
      desc: '6 trò chơi học tập tương tác đa dạng khơi dậy hứng thú, học sinh làm chủ kiến thức một cách tự nhiên và say mê.',
      icon: '🎮',
      color: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      title: 'Theo dõi tiến bộ liên tục',
      desc: 'Ghi nhận từng bước phát triển của mỗi em so với chính mình, không tạo áp lực xếp hạng hay so sánh tiêu cực.',
      icon: '📈',
      color: 'bg-teal-50 border-teal-200 text-teal-700',
    },
    {
      title: 'Phát triển năng lực tự học',
      desc: 'Robot Bạn Học AI đồng hành gợi mở từng bước, khuyến khích học sinh tự tìm ra cách giải quyết vấn đề.',
      icon: '💡',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* HERO BANNER SECTION (Inspired directly by the poster) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white shadow-xl shadow-blue-200/50 p-6 sm:p-10 lg:p-12">
        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-teal-400/20 blur-xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/30 text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Chương trình GDPT 2018 • Trường Tiểu học Khoái Châu 1</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                AI ĐỒNG HÀNH
              </h1>
              <p className="text-lg sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wide">
                Phát triển học sinh Lớp 4 toàn diện
              </p>
            </div>

            <p className="text-sm sm:text-base text-blue-100 font-medium max-w-xl leading-relaxed">
              "Lấy học sinh làm trung tâm – AI đồng hành khơi mở tiềm năng của mỗi em!"
              Cá nhân hóa học tập – Tăng hứng thú – Phát triển phẩm chất và năng lực số tự tin bước vào tương lai.
            </p>

            {/* 4 Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onNavigate('learning')}
                className="flex items-center gap-2 px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-2xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <BookOpen className="w-4 h-4 text-slate-900" />
                <span>BẮT ĐẦU HỌC</span>
              </button>

              <button
                onClick={() => onNavigate('textbooks')}
                className="flex items-center gap-2 px-5 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <span>📖 SGK 35 TUẦN</span>
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="flex items-center gap-2 px-5 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-900 font-black rounded-2xl shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Gamepad2 className="w-4 h-4 text-slate-900" />
                <span>KHÁM PHÁ TRÒ CHƠI</span>
              </button>

              <button
                onClick={() => onNavigate('robot-tutor')}
                className="flex items-center gap-2 px-5 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-black rounded-2xl border border-white/40 shadow-md transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>TRÒ CHUYỆN VỚI AI</span>
              </button>
            </div>

            {/* Teacher and Class attribution badge */}
            <div className="pt-2 text-xs text-blue-200 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1">
              <span>Giáo viên: <strong className="text-white">Nguyễn Thị Cẩm Vân</strong></span>
              <span>•</span>
              <span>Lớp: <strong className="text-white">4B</strong></span>
              <span>•</span>
              <span>Năm học: <strong className="text-white">2026</strong></span>
            </div>
          </div>

          {/* Right Mascot & Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative w-full max-w-sm">
              <RobotMascot
                size="xl"
                expression="happy"
                showBubble
                bubbleText="Chào bạn nhỏ! Tớ là Robot Bạn Học AI!"
              />

              <div className="mt-4 bg-white/90 text-slate-800 p-3.5 rounded-2xl w-full shadow-md text-xs sm:text-sm font-semibold space-y-1">
                <p className="text-blue-700 font-bold">✨ Góc học tập hôm nay:</p>
                <p className="text-slate-600">
                  Chào <span className="text-blue-600 font-extrabold">{student.name}</span>! Bạn có 1 bài học mới môn Toán và 6 trò chơi thú vị đang chờ!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY PROGRESS BANNER (Card "Hôm nay em đã tiến bộ ở nội dung nào?") */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                Hôm nay em đã tiến bộ ở nội dung nào?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Ghi nhận sự nỗ lực và tiến bộ vượt trội của <strong className="text-blue-700">{student.name}</strong> qua từng buổi học:
            </p>
          </div>

          <button
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            <span>Xem hồ sơ tiến bộ đầy đủ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-800">Toán học</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                Mức: {student.adaptiveLevel.math}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              ✓ Đã thành thạo nhận biết giá trị hàng và lớp của số có sáu chữ số.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-800">Tiếng Việt</span>
              <span className="text-[10px] bg-amber-200/70 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">
                Mức: {student.adaptiveLevel.vietnamese}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              ✓ Vận dụng linh hoạt động từ chỉ hoạt động vào viết câu văn miêu tả sinh động.
            </p>
          </div>

          <div className="bg-teal-50/70 border border-teal-200/80 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-teal-800">Khoa học</span>
              <span className="text-[10px] bg-teal-200/70 text-teal-800 font-extrabold px-2 py-0.5 rounded-full">
                Mức: {student.adaptiveLevel.science}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              ✓ Hiểu rõ sơ đồ ba thể của nước và ý thức bảo vệ tiết kiệm nguồn nước sạch.
            </p>
          </div>
        </div>
      </section>

      {/* 4 CORE PILLARS SECTION (From poster) */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Nền tảng vững chắc
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Bốn Trụ Cột Triển Khai Toàn Diện
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Mô hình giáo dục thông minh kết nối chặt chẽ giữa Học sinh – Giáo viên – Phụ huynh và Trợ lý AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fourPillars.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all hover:shadow-lg hover:-translate-y-1 ${p.color} bg-white shadow-xs space-y-3`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-xs">
                {p.icon}
              </div>
              <h3 className="font-black text-base text-slate-800">
                {p.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECTS DISCOVERY (Các môn học lớp 4 GDPT 2018) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Khám Phá Các Môn Học Lớp 4
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chương trình chuẩn GDPT 2018 với 5 bước học tập thông minh.
            </p>
          </div>
          <button
            onClick={() => onNavigate('learning')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Tất cả bài học</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECTS.slice(0, 6).map(sub => (
            <div
              key={sub.id}
              onClick={() => onNavigate('learning')}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                    {sub.id === 'math' ? '🔢' : sub.id === 'vietnamese' ? '📖' : sub.id === 'science' ? '🧪' : sub.id === 'history_geo' ? '🧭' : sub.id === 'ethics' ? '❤️' : '💻'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {sub.topicsCount} chủ đề
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Vào góc học tập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK BANNER TO 6 GAMES */}
      <section className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-lg shadow-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-white/80 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            6 Trò chơi học tập sinh động
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">
            Vừa Học Vừa Chơi – Chinh Phục Điểm Thưởng!
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
            AI Hái Hoa Tri Thức, Vòng Quay May Mắn, AI Đấu Trường, Giải Cứu Robot, Ghép Cặp Thông Minh, Nhà Thám Hiểm Nhí!
          </p>
        </div>

        <button
          onClick={() => onNavigate('games')}
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap"
        >
          CHƠI NGAY HÔM NAY 🎮
        </button>
      </section>
    </div>
  );
};
