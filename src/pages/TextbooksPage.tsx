import React, { useState } from 'react';
import { GRADE_4_TEXTBOOKS } from '../data/mockData';
import { TextbookInfo, SubjectId } from '../types';
import { soundManager } from '../services/soundEffects';
import { 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Compass, 
  School,
  ChevronRight,
  Filter
} from 'lucide-react';

export const TextbooksPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'sem1' | 'sem2'>('all');
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState('');

  const OFFICIAL_URL = 'https://taphuan.nxbgd.vn/tap-huan?grade=4';

  const filteredBooks = GRADE_4_TEXTBOOKS.filter(book => {
    const matchSubject = selectedSubject === 'all' || book.subjectId === selectedSubject;
    const matchSearch = book.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header with Direct Link to taphuan.nxbgd.vn */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/30 text-amber-200">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Chương Trình GDPT 2018 • Toàn Diện 35 Tuần Học</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              SÁCH GIÁO KHOA LỚP 4
            </h1>
            <p className="text-base sm:text-xl font-bold text-amber-300">
              Tất cả các môn học chuẩn 35 tuần – NXB Giáo Dục Việt Nam
            </p>
          </div>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Hệ thống hóa chương trình SGK Lớp 4 (Kết nối tri thức với cuộc sống, Chân trời sáng tạo, Cánh diều) trải dài từ <strong>Tuần 1 đến Tuần 35</strong>. 
            Cung cấp đường dẫn chính thức đến cổng sách giáo khoa điện tử và tài liệu tập huấn giáo viên.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-2xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
            >
              <span>MỞ SÁCH GIÁO KHOA ĐIỆN TỬ (NXBGDEVN)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onNavigate('learning')}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-2xl border border-white/30 text-xs sm:text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Vào Góc Học Tập & Luyện Tập</span>
            </button>
          </div>
        </div>

        {/* Decorative background badges */}
        <div className="absolute right-4 bottom-4 opacity-10 text-9xl pointer-events-none select-none hidden md:block">
          📚
        </div>
      </section>

      {/* 35-Week Curriculum Timeline Indicator */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Lộ Trình Phân Phối Chương Trình 35 Tuần (GDPT 2018)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Khung kế hoạch dạy học năm học 2026 tại Trường Tiểu học Khoái Châu 1.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-200">
              Học kì 1: Tuần 1 – 18
            </span>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl border border-emerald-200">
              Học kì 2: Tuần 19 – 35
            </span>
          </div>
        </div>

        {/* Week Pills Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Chọn nhanh tuần học:</span>
            {selectedWeek > 0 && (
              <button
                onClick={() => setSelectedWeek(0)}
                className="text-blue-600 hover:underline"
              >
                Hiển thị tất cả 35 tuần
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedWeek(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedWeek === 0
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả 35 tuần
            </button>
            {Array.from({ length: 35 }, (_, i) => i + 1).map(wk => (
              <button
                key={wk}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedWeek(wk);
                }}
                className={`w-9 h-8 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                  selectedWeek === wk
                    ? 'bg-amber-400 text-slate-900 shadow-xs font-black scale-105 ring-2 ring-amber-300'
                    : wk <= 18
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
                title={`Tuần ${wk} (${wk <= 18 ? 'Học kỳ 1' : 'Học kỳ 2'})`}
              >
                {wk}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm môn học, chủ đề, kiến thức trọng tâm..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-2xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="all">Tất cả môn học lớp 4 ({GRADE_4_TEXTBOOKS.length})</option>
            <option value="math">Toán học 4</option>
            <option value="vietnamese">Tiếng Việt 4</option>
            <option value="science">Khoa học 4</option>
            <option value="history_geo">Lịch sử & Địa lí 4</option>
            <option value="ethics">Đạo đức 4</option>
            <option value="informatics">Tin học 4</option>
            <option value="technology">Công nghệ 4</option>
            <option value="experiential">Hoạt động trải nghiệm 4</option>
            <option value="english">Tiếng Anh 4</option>
            <option value="music">Âm nhạc 4</option>
            <option value="arts">Mĩ thuật 4</option>
            <option value="pe">Giáo dục thể chất 4</option>
          </select>
        </div>
      </div>

      {/* Grid of All Grade 4 Textbooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Book Banner */}
            <div className={`p-5 bg-gradient-to-r ${book.coverColor} text-white space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
                  {book.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                  {book.totalWeeks} Tuần học
                </span>
              </div>

              <div>
                <h3 className="font-black text-base sm:text-lg leading-tight group-hover:text-amber-200 transition-colors">
                  {book.subjectName}
                </h3>
                <p className="text-[11px] text-white/80 font-medium">
                  {book.bookSeries}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {book.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] space-y-1.5 text-slate-700">
                  <p>
                    <strong className="text-blue-700">Học kì 1:</strong> {book.semester1Weeks}
                  </p>
                  <p>
                    <strong className="text-emerald-700">Học kì 2:</strong> {book.semester2Weeks}
                  </p>
                </div>

                {/* Sample Weekly topics */}
                {book.sampleWeeklyPlan && book.sampleWeeklyPlan.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Các tuần học tiêu biểu:
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {book.sampleWeeklyPlan
                        .filter(w => selectedWeek === 0 || w.week === selectedWeek)
                        .map((w, wi) => (
                          <div
                            key={wi}
                            className="p-2 bg-slate-50 rounded-xl text-xs flex items-start justify-between gap-2 border border-slate-100"
                          >
                            <span className="font-bold text-blue-700 shrink-0">Tuần {w.week}:</span>
                            <span className="text-slate-800 font-semibold truncate flex-1">{w.title}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Official Link Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={book.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-xs transition-colors"
                >
                  <span>Xem Sách Điện Tử</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onNavigate('learning')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  title="Vào bài tập luyện tập"
                >
                  Luyện tập
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 text-xs">
          Không tìm thấy môn học phù hợp với từ khóa. Vui lòng chọn môn khác.
        </div>
      )}

      {/* Official Publisher Banner Callout */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-black text-sm text-amber-900 flex items-center gap-2 justify-center sm:justify-start">
            <School className="w-4 h-4 text-amber-600" />
            <span>Cổng Thông Tin Tập Huấn Sách Giáo Khoa Lớp 4 (NXBGDVN)</span>
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Học sinh, giáo viên và phụ huynh có thể tra cứu toàn bộ bản mẫu sách giáo khoa, sách giáo viên, video bài giảng tập huấn chính thức tại cổng thông tin: <strong>https://taphuan.nxbgd.vn/tap-huan?grade=4</strong>
          </p>
        </div>

        <a
          href={OFFICIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-2xl text-xs shadow-md whitespace-nowrap transition-transform active:scale-95 inline-flex items-center gap-1.5"
        >
          <span>TRUY CẬP NGAY</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
