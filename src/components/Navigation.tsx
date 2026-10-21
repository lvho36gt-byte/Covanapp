import React from 'react';
import { 
  Home, 
  BookOpen, 
  Bot, 
  Gamepad2, 
  Palette, 
  FolderArchive, 
  TrendingUp, 
  GraduationCap, 
  Users, 
  FileText,
  BookMarked
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { currentRole } = useApp();

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, roles: ['student', 'teacher', 'parent'] },
    { id: 'textbooks', label: 'SGK 35 Tuần', icon: BookMarked, badge: 'NXBGD', roles: ['student', 'teacher', 'parent'] },
    { id: 'learning', label: 'Góc học tập', icon: BookOpen, roles: ['student', 'teacher'] },
    { id: 'robot-tutor', label: 'Học cùng AI', icon: Bot, badge: 'AI', roles: ['student', 'teacher', 'parent'] },
    { id: 'games', label: 'Trò chơi (6)', icon: Gamepad2, roles: ['student', 'teacher'] },
    { id: 'creative', label: 'Góc sáng tạo', icon: Palette, roles: ['student', 'teacher'] },
    { id: 'progress', label: 'Tiến bộ của em', icon: TrendingUp, roles: ['student', 'teacher', 'parent'] },
    { id: 'library', label: 'Thư viện số', icon: FolderArchive, roles: ['student', 'teacher'] },
    { id: 'teacher', label: 'Góc giáo viên', icon: GraduationCap, badge: 'Quản lý', roles: ['teacher', 'student'] },
    { id: 'parent', label: 'Kết nối phụ huynh', icon: Users, roles: ['parent', 'teacher', 'student'] },
    { id: 'intro', label: 'Giải pháp 2026', icon: FileText, roles: ['student', 'teacher', 'parent'] },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[72px] sm:top-[74px] z-30 shadow-2xs overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-start md:justify-center gap-1 sm:gap-2 py-1.5 min-w-max">
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-sky-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
