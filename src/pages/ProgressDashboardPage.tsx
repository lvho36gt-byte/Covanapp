import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BADGES } from '../data/mockData';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  Calendar, 
  Star, 
  Flame, 
  Zap,
  BarChart3,
  Bot
} from 'lucide-react';

export const ProgressDashboardPage: React.FC = () => {
  const { student, quizAttempts, triggerCelebration } = useApp();
  const [filterSubject, setFilterSubject] = useState<'all' | 'math' | 'vietnamese' | 'science'>('all');

  const filteredAttempts = filterSubject === 'all' 
    ? quizAttempts 
    : quizAttempts.filter(a => a.subjectId === filterSubject);

  const totalScore = quizAttempts.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore = quizAttempts.length > 0 ? (totalScore / quizAttempts.length).toFixed(1) : '10.0';

  // Badge list with unlock check
  const allBadgesWithStatus = BADGES.map(b => ({
    ...b,
    isUnlocked: student.badges.includes(b.id),
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Phân hệ 7 & 10 • Theo dõi tiến bộ & Vinh danh
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Bảng Theo Dõi Tiến Bộ Của Em</span>
            <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              {student.name} • Lớp 4B
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Ghi nhận sự tiến bộ của bản thân qua từng tuần học, không so sánh hay tạo áp lực điểm số.
          </p>
        </div>

        <button
          onClick={triggerCelebration}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 px-4 py-2 rounded-2xl text-xs font-extrabold shadow-sm transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-slate-900" />
          <span>Bắn pháo hoa chúc mừng 🎉</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Điểm tích lũy</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700">{student.points}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Tăng từ hoạt động & bài tập</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Điểm trung bình</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{avgScore} / 10</p>
          <span className="text-[11px] text-slate-500 font-semibold">{quizAttempts.length} lượt hoàn thành</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Huy hiệu đạt được</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600">{student.badges.length} / {BADGES.length}</p>
          <span className="text-[11px] text-purple-600 font-semibold">Tiến bộ vượt trội</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Chuỗi ngày học tập</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-600">{student.streakDays} ngày</p>
          <span className="text-[11px] text-orange-600 font-semibold">Duy trì thói quen tự giác</span>
        </div>
      </div>

      {/* Adaptive Matrix & Progress Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Adaptive Levels by Subject */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Năng Lực Cá Nhân Hóa (4 Mức Độ)</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">GDPT 2018</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Hệ thống tự động thích ứng: Nhận biết ➔ Thông hiểu ➔ Vận dụng ➔ Vận dụng cao.
          </p>

          <div className="space-y-4 pt-1">
            {[
              { subject: 'Toán học', level: student.adaptiveLevel.math, color: 'bg-blue-600', val: 75 },
              { subject: 'Tiếng Việt', level: student.adaptiveLevel.vietnamese, color: 'bg-amber-500', val: 85 },
              { subject: 'Khoa học', level: student.adaptiveLevel.science, color: 'bg-emerald-600', val: 70 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.subject}</span>
                  <span className="text-blue-700 font-extrabold bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    Mức: {item.level}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.val}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Nhận biết</span>
                  <span>Thông hiểu</span>
                  <span>Vận dụng</span>
                  <span>Vận dụng cao</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Pedagogical Analysis */}
        <div className="lg:col-span-6 bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-7 border border-teal-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-teal-950 flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600" />
              <span>Phân Tích Sư Phạm Của AI</span>
            </h3>
            <span className="text-[10px] font-bold bg-white text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
              Cập nhật hôm nay
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-2xs space-y-1">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nội dung em đã cải thiện rất tốt:</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                • Nhận diện chính xác giá trị theo hàng và lớp trong số tự nhiên có 6 chữ số.<br />
                • Vận dụng động từ sinh động trong bài viết câu kể chuyện.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-2xs space-y-1">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Nội dung cần củng cố thêm:</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                • Cẩn thận hơn khi thực hiện bài toán có lời văn làm tròn số đến hàng chục nghìn.<br />
                • Tiếp tục thử sức với các tình huống Vận dụng cao môn Khoa học.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BADGES GALLERY SECTION (Vinh danh tiến bộ) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🏆 Hệ Thống Huy Hiệu Tiến Bộ</span>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                6 Huy hiệu
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Vinh danh tinh thần tự học, tính kiên trì và sáng tạo của mỗi học sinh lớp 4B.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Đã mở khóa: <strong>{student.badges.length}/6</strong> huy hiệu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadgesWithStatus.map(badge => (
            <div
              key={badge.id}
              onClick={() => {
                if (badge.isUnlocked) {
                  triggerCelebration();
                }
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                badge.isUnlocked
                  ? 'bg-gradient-to-br from-amber-50/60 to-yellow-50/80 border-amber-300 shadow-xs hover:shadow-md hover:scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0 ${
                  badge.isUnlocked ? 'bg-amber-100 animate-wiggle' : 'bg-slate-200'
                }`}
              >
                {badge.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-800">
                    {badge.name}
                  </h4>
                  {badge.isUnlocked && (
                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full uppercase">
                      Đã đạt
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-amber-700">
                  {badge.title}
                </p>
                <p className="text-xs text-slate-600 leading-snug">
                  {badge.description}
                </p>
                {badge.unlockedAt && (
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Đạt được ngày: {badge.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Attempts History Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-800">
          Nhật ký hoàn thành bài tập gần đây:
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Môn học / Bài</th>
                <th className="pb-3">Thời gian</th>
                <th className="pb-3">Điểm</th>
                <th className="pb-3">Nhận xét của hệ thống</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quizAttempts.map(att => (
                <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-800">
                    {att.subjectId === 'math' ? 'Toán học' : att.subjectId === 'vietnamese' ? 'Tiếng Việt' : 'Khoa học'} ({att.lessonId})
                  </td>
                  <td className="py-3 text-slate-500">{att.completedAt}</td>
                  <td className="py-3 font-extrabold text-blue-700">
                    <span className="bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                      {att.score}/10
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{att.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
