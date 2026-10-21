import React, { useState } from 'react';
import { CONTEST_SURVEY_DATA } from '../data/mockData';
import { RobotMascot } from '../components/RobotMascot';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Award, 
  School, 
  Printer, 
  BookOpen, 
  ShieldCheck,
  Target,
  BarChart2
} from 'lucide-react';

export const ProjectIntroPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dossier'>('overview');

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-teal-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/30 text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Hồ sơ giải pháp đổi mới sáng tạo giáo dục 2026</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            GIẢI PHÁP AI ĐỒNG HÀNH 2026
          </h1>
          <p className="text-lg sm:text-xl font-extrabold text-amber-300">
            Phát Triển Học Sinh Lớp 4 Toàn Diện Theo Chương Trình GDPT 2018
          </p>
        </div>

        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          "Lấy học sinh làm trung tâm – AI đồng hành khơi mở tiềm năng của mỗi em!"
          Một giải pháp thực tiễn được nghiên cứu, thiết kế và ứng dụng thành công tại Lớp 4B, Trường Tiểu học Khoái Châu 1, Tỉnh Hưng Yên.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-100 font-semibold border-t border-white/20">
          <span>Giáo viên thực hiện: <strong className="text-white">Nguyễn Thị Cẩm Vân</strong></span>
          <span>•</span>
          <span>Đơn vị: <strong className="text-white">Trường Tiểu học Khoái Châu 1</strong></span>
          <span>•</span>
          <span>Năm: <strong className="text-white">2026</strong></span>
        </div>
      </div>

      {/* 6 Nội Dung Cốt Lõi Từ Poster */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Bố cục poster dự án
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Sáu Trụ Cột Nội Dung Của Giải Pháp
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kế thừa trọn vẹn tinh thần và cấu trúc đề tài đổi mới phương pháp dạy học tiểu học.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Nhu cầu học sinh */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              Nhu Cầu Của Học Sinh Lớp 4
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Học sinh lớp 4 (9-10 tuổi) có sự phân hóa tự nhiên về tốc độ tiếp thu kiến thức. Các em cần phương pháp học tập trực quan, nhiều hình ảnh, phản hồi nhẹ nhàng, được khích lệ thường xuyên và không bị áp lực xếp hạng hay so sánh.
            </p>
          </div>

          {/* 2. Giải pháp AI */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              Giải Pháp Tích Hợp AI
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI đóng vai trò người bạn đồng hành kiên nhẫn: không giải hộ bài mà hướng dẫn từng bước nhỏ (Socratic), gợi mở tư duy, cá nhân hóa độ khó theo 4 mức độ nhận thức của GDPT 2018 và hỗ trợ giáo viên tạo kho học liệu phong phú.
            </p>
          </div>

          {/* 3. Bốn trụ cột */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              Bốn Trụ Cột Triển Khai
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Cá nhân hóa lộ trình học.<br />
              2. Học mà chơi – Chơi mà học qua 6 trò chơi tương tác.<br />
              3. Theo dõi tiến bộ liên tục từng học sinh.<br />
              4. Phát triển năng lực số và tính tự học chủ động.
            </p>
          </div>

          {/* 4. Sản phẩm minh họa */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              Sản Phẩm & Hoạt Động Cụ Thể
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống hoàn chỉnh 10 phân hệ: Góc học tập 5 bước, Chatbot Robot Bạn Học AI, 6 mini-game tương tác, Xưởng sáng tạo học liệu số, Góc sáng tạo nhí, Kệ sách thư viện điện tử, Bảng kết nối phụ huynh.
            </p>
          </div>

          {/* 5. Kết quả tác động */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-lg">
              5
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              Đo Lường Hiệu Quả Thực Tế
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Số liệu khảo sát trước và sau triển khai tại lớp 4B cho thấy mức độ tự giác học tập tăng từ 48% lên 88.5%, mức độ hào hứng phát biểu bài đạt 94.2% và sự đồng hành của phụ huynh đạt 93%.
            </p>
          </div>

          {/* 6. Minh chứng thực tế */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-lg">
              6
            </div>
            <h3 className="font-extrabold text-base text-slate-800">
              Minh Chứng Thực Tế & Hồ Sơ
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Các sản phẩm truyện ngắn, sơ đồ tư duy của học sinh, phản hồi tin nhắn của phụ huynh và phiếu bài tập A4 được lưu trữ minh bạch, sẵn sàng phục vụ báo cáo đánh giá sáng kiến kinh nghiệm.
            </p>
          </div>
        </div>
      </section>

      {/* Bảng Đo Lường So Sánh Trước & Sau */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <span>Bảng Đo Lường Khảo Sát Hiệu Quả Ứng Dụng (Lớp 4B)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Đánh giá thực nghiệm trên cùng thang đo trước và sau khi triển khai giải pháp AI ĐỒNG HÀNH.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo Bảng Đo Lường</span>
          </button>
        </div>

        <div className="space-y-4">
          {CONTEST_SURVEY_DATA.map((row, idx) => {
            const diff = (row.afterRate - row.beforeRate).toFixed(1);
            return (
              <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                    {idx + 1}. {row.criterion}
                  </h4>
                  <span className="font-black text-xs text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                    + {diff}% {row.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trước khi áp dụng:</span>
                    <strong className="text-slate-700 text-sm">{row.beforeRate}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sau khi áp dụng:</span>
                    <strong className="text-blue-700 text-sm">{row.afterRate}%</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[11px]">Ghi chú nhận định:</span>
                    <span className="text-slate-600 text-[11px] leading-snug block">{row.note}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pedagogical Statement & Call to action */}
      <section className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 p-8 rounded-3xl text-center space-y-4">
        <RobotMascot size="md" expression="celebrating" />
        <h3 className="text-xl sm:text-2xl font-black text-blue-900">
          "AI không làm thay học sinh, mà đồng hành để mỗi em học tập chủ động, tiến bộ và sáng tạo hơn mỗi ngày."
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Đề tài sáng kiến kinh nghiệm giáo dục tiểu học năm 2026 • Cô giáo Nguyễn Thị Cẩm Vân • Lớp 4B • Trường Tiểu học Khoái Châu 1.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-md transition-all text-xs sm:text-sm"
          >
            Quay Về Trang Chủ Khám Phá
          </button>
        </div>
      </section>
    </div>
  );
};
