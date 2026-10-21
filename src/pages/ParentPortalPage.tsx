import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../services/soundEffects';
import { Users, Heart, MessageSquare, Send, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export const ParentPortalPage: React.FC = () => {
  const { student, quizAttempts, parentNotes, sendParentMessage } = useApp();
  const [messageText, setMessageText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    soundManager.playClick();
    sendParentMessage(messageText.trim());
    setMessageText('');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  const aiParentTips = [
    {
      title: 'Khen ngợi nỗ lực thay vì điểm số tuyệt đối',
      desc: `Khi ${student.name} khoe giải xong một bài toán khó, bố mẹ hãy khen: "Bố mẹ rất tự hào vì con đã kiên trì suy nghĩ đến cùng!" để con nuôi dưỡng tư duy phát triển.`,
    },
    {
      title: 'Học thông qua việc đố vui trong bữa cơm',
      desc: `Bố mẹ có thể nhờ con đóng vai làm "thầy cô giáo tí hon" giải thích lại cho bố mẹ nghe về ba thể của nước hoặc vòng tuần hoàn nước nhé!`,
    },
    {
      title: 'Tạo không gian yên tĩnh 20 phút mỗi tối',
      desc: `Khuyến khích con tự giác vào Góc Học Tập AI hoặc chơi một trò chơi trí tuệ, sau đó bố mẹ cùng kiểm tra xem con đã tích lũy thêm bao nhiêu điểm thưởng.`,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Phân hệ 8 • Gia đình và nhà trường
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Cha Mẹ Đồng Hành Cùng Con</span>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              Bé {student.name} • 4B
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kênh thông tin riêng tư kết nối giữa Phụ huynh và Cô giáo Nguyễn Thị Cẩm Vân (Trường Tiểu học Khoái Châu 1).
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-2xl font-bold">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Bảo mật thông tin riêng tư 100%</span>
        </div>
      </div>

      {/* Child Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Học tập hôm nay
          </span>
          <h3 className="font-extrabold text-base text-slate-800">
            Số có sáu chữ số & Lớp nghìn
          </h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã hoàn thành luyện tập (10/10 điểm)</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Mục tiêu học tập tiếp theo
          </span>
          <h3 className="font-extrabold text-base text-slate-800">
            Luyện từ và câu: Danh từ & Động từ
          </h3>
          <p className="text-xs text-blue-600 font-semibold">
            Chuẩn bị bài học Tuần 3 cùng lớp 4B
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Điểm tích lũy & Huy hiệu
          </span>
          <h3 className="font-extrabold text-base text-slate-800">
            {student.points} điểm • {student.badges.length} huy hiệu
          </h3>
          <p className="text-xs text-amber-600 font-semibold">
            Chuỗi {student.streakDays} ngày chăm chỉ liên tiếp ⭐
          </p>
        </div>
      </div>

      {/* Teacher Note & AI Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: AI Home Support Tips */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>Gợi Ý Của AI Để Bố Mẹ Đồng Hành Tại Nhà</span>
          </h3>

          <div className="space-y-4">
            {aiParentTips.map((tip, idx) => (
              <div key={idx} className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-rose-950">
                  {idx + 1}. {tip.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Messages with Teacher */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Trao Đổi Với Cô Cẩm Vân</span>
          </h3>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={3}
              placeholder="Gửi lời nhắn hoặc trao đổi với cô giáo về tình hình học tập của con..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl p-3 text-xs outline-none transition-all"
            ></textarea>

            <button
              type="submit"
              disabled={!messageText.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi lời nhắn cho cô giáo</span>
            </button>

            {isSent && (
              <p className="text-xs text-emerald-600 font-bold text-center">
                ✓ Lời nhắn đã được chuyển đến cô giáo Cẩm Vân!
              </p>
            )}
          </form>

          {/* Notes History */}
          <div className="space-y-3 pt-2 border-t border-slate-100 max-h-[300px] overflow-y-auto pr-1">
            {parentNotes.map(note => (
              <div key={note.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700">{note.senderName}</span>
                  <span>{note.date}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{note.message}</p>

                {note.replyFromTeacher && (
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-blue-950 mt-1">
                    <strong>Cô Cẩm Vân:</strong> {note.replyFromTeacher}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
