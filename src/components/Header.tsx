import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Sparkles, User, Award, Flame, RefreshCw, ExternalLink, BookOpen, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC<{ onNavigate: (page: string) => void; currentPage: string }> = ({
  onNavigate,
  currentPage,
}) => {
  const { currentRole, setCurrentRole, student, students, selectStudent, isSoundMuted, toggleSound, resetDefaultData } = useApp();
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  const roles: { id: UserRole; label: string; icon: string; desc: string }[] = [
    { id: 'student', label: 'Học sinh', icon: '👦', desc: `${student.name} (4B)` },
    { id: 'teacher', label: 'Giáo viên', icon: '👩‍🏫', desc: 'Cô Nguyễn Thị Cẩm Vân' },
    { id: 'parent', label: 'Phụ huynh', icon: '👨‍👩‍👧', desc: `Gia đình bé ${student.name}` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice with Official Textbook Link */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-teal-500 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 font-medium flex-wrap">
          {/* Direct link to taphuan.nxbgd.vn */}
          <a
            href="https://taphuan.nxbgd.vn/tap-huan?grade=4"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            title="Mở Cổng Sách Giáo Khoa Lớp 4 (35 Tuần) - NXB Giáo Dục Việt Nam"
          >
            <span>📖 SGK LỚP 4 (35 TUẦN)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <span className="hidden sm:inline">
            <strong className="font-bold">AI ĐỒNG HÀNH – Phát triển học sinh Lớp 4 toàn diện</strong>
          </span>
          <span className="hidden md:inline text-sky-100">
            • Trường Tiểu học Khoái Châu 1 • GVCN: Nguyễn Thị Cẩm Vân
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục danh sách và dữ liệu mặc định?')) {
                resetDefaultData();
              }
            }}
            title="Khôi phục danh sách và dữ liệu mặc định"
            className="flex items-center gap-1 hover:text-amber-200 transition-colors text-[11px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Dữ liệu gốc</span>
          </button>

          <button
            onClick={toggleSound}
            className="flex items-center gap-1 hover:text-amber-200 transition-colors"
            title={isSoundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-red-300" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
            <span className="hidden lg:inline text-[11px]">{isSoundMuted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-700">
                AI ĐỒNG HÀNH
              </span>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Lớp 4B
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
              "Lấy học sinh làm trung tâm – AI khơi mở tiềm năng!"
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Student Switcher Widget */}
          <div className="relative">
            <button
              onClick={() => setShowStudentMenu(!showStudentMenu)}
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-blue-800 transition-colors"
              title="Đổi học sinh trong lớp 4B"
            >
              <span>{student.avatar}</span>
              <span className="max-w-[100px] sm:max-w-[140px] truncate">{student.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
            </button>

            {/* Dropdown list of students in Class 4B */}
            {showStudentMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Học sinh Lớp 4B ({students.length})</span>
                  <button
                    onClick={() => {
                      setShowStudentMenu(false);
                      onNavigate('teacher');
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Quản lý
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {students.map(st => (
                    <button
                      key={st.id}
                      onClick={() => {
                        selectStudent(st.id);
                        setShowStudentMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        st.id === student.id
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{st.avatar}</span>
                        <span className="truncate">{st.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-bold shrink-0">{st.points}đ</span>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowStudentMenu(false);
                      onNavigate('teacher');
                    }}
                    className="w-full text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                  >
                    + Thêm / Xóa học sinh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Status Quick Widget */}
          {currentRole === 'student' && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-50/80 border border-amber-200/70 px-3 py-1.5 rounded-2xl">
              <div className="flex items-center gap-1 text-amber-700 font-bold text-xs" title="Điểm học tập tích lũy">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{student.points}đ</span>
              </div>
              <div className="h-3 w-px bg-amber-200"></div>
              <div className="flex items-center gap-1 text-orange-600 font-bold text-xs" title="Chuỗi ngày chăm chỉ">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{student.streakDays} ngày</span>
              </div>
            </div>
          )}

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            {roles.map(r => {
              const active = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    if (r.id === 'teacher' && currentPage === 'home') {
                      onNavigate('teacher');
                    } else if (r.id === 'parent' && currentPage === 'home') {
                      onNavigate('parent');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all ${
                    active
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`${r.label}: ${r.desc}`}
                >
                  <span>{r.icon}</span>
                  <span className="hidden md:inline">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
