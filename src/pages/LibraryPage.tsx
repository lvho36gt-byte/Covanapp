import React, { useState } from 'react';
import { DIGITAL_LIBRARY } from '../data/mockData';
import { LibraryResource, SubjectId } from '../types';
import { soundManager } from '../services/soundEffects';
import { 
  FolderArchive, 
  Search, 
  Download, 
  FileText, 
  Video, 
  Eye, 
  Plus, 
  Sparkles,
  BookOpen,
  Check,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LibraryPage: React.FC = () => {
  const { currentRole } = useApp();
  const [resources, setResources] = useState<LibraryResource[]>(DIGITAL_LIBRARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<LibraryResource | null>(null);

  // Add resource modal for teacher
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('math');
  const [newCategory, setNewCategory] = useState<'lesson_plan' | 'worksheet' | 'mindmap' | 'video' | 'interactive'>('worksheet');
  const [newDesc, setNewDesc] = useState('');

  const filtered = resources.filter(res => {
    const matchSubject = selectedSubject === 'all' || res.subjectId === selectedSubject;
    const matchCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchCategory && matchSearch;
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playCorrect();
    const item: LibraryResource = {
      id: `lib-${Date.now()}`,
      title: newTitle.trim(),
      subjectId: newSubject,
      category: newCategory,
      format: newCategory === 'worksheet' ? 'PDF' : newCategory === 'video' ? 'VIDEO' : 'DOCX',
      week: 4,
      fileSize: '2.1 MB',
      description: newDesc.trim() || 'Tài liệu học tập Lớp 4 chuẩn GDPT 2018 biên soạn bởi cô Cẩm Vân.',
    };

    setResources(prev => [item, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDownload = (res: LibraryResource) => {
    soundManager.playClick();
    alert(`Đang tải tệp: "${res.title}" (${res.format} - ${res.fileSize}). Hệ thống đã kiểm tra định dạng an toàn cho học sinh.`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Phân hệ 9 • Kệ sách thông minh
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Thư Viện Học Liệu Số Lớp 4</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {resources.length} tài nguyên
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Giáo án điện tử, phiếu bài tập in ấn, video bài giảng 3D và tài liệu giáo dục địa phương Khoái Châu.
          </p>
        </div>

        {currentRole === 'teacher' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài liệu mới</span>
          </button>
        )}
      </div>

      {/* Official SGK 35 Tuần Portal Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="font-black text-sm sm:text-base">Sách Giáo Khoa Lớp 4 (35 Tuần) – NXB Giáo Dục Việt Nam</h3>
          </div>
          <p className="text-xs text-blue-100 max-w-xl">
            Tra cứu đầy đủ bản mẫu sách giáo khoa điện tử, tài liệu tập huấn và kế hoạch bài dạy chuẩn 35 tuần cho tất cả các môn học.
          </p>
        </div>

        <a
          href="https://taphuan.nxbgd.vn/tap-huan?grade=4"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          <span>Mở Cổng SGK (NXBGD)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

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
              placeholder="Tìm kiếm tài liệu, giáo án, phiếu bài tập..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-2xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="all">Tất cả môn học</option>
            <option value="math">Toán học</option>
            <option value="vietnamese">Tiếng Việt</option>
            <option value="science">Khoa học</option>
            <option value="history_geo">Lịch sử & Địa lí</option>
            <option value="informatics">Tin học & Công nghệ</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-2xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="all">Tất cả định dạng</option>
            <option value="lesson_plan">Giáo án số (DOCX)</option>
            <option value="worksheet">Phiếu học tập (PDF)</option>
            <option value="mindmap">Sơ đồ tư duy</option>
            <option value="video">Video bài giảng</option>
            <option value="interactive">Tương tác trực tuyến</option>
          </select>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(res => (
          <div
            key={res.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {res.format} • {res.fileSize}
                </span>
                <span className="text-slate-400 font-semibold">Tuần {res.week}</span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {res.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveItem(res)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem chi tiết</span>
              </button>

              <button
                onClick={() => handleDownload(res)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 text-xs">
          Không tìm thấy tài liệu phù hợp với bộ lọc. Hãy thử tìm bằng từ khóa khác.
        </div>
      )}

      {/* Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                {activeItem.format} • Tuần {activeItem.week}
              </span>
              <button onClick={() => setActiveItem(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕ Đóng
              </button>
            </div>

            <h3 className="font-black text-base text-slate-800">
              {activeItem.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeItem.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border text-xs text-slate-500 space-y-1">
              <p>• Dung lượng: <strong>{activeItem.fileSize}</strong></p>
              <p>• Đơn vị ban hành: Trường Tiểu học Khoái Châu 1</p>
              <p>• Bản quyền: Học liệu dùng chung cho học sinh lớp 4B</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownload(activeItem)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tài liệu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal for Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddResource} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-base text-slate-800">
              Thêm Tài Liệu Học Liệu Mới (Cô Cẩm Vân)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên tài liệu:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Phiếu ôn tập tuần 4 môn Toán..."
                  className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Môn học:</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value as any)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none"
                  >
                    <option value="math">Toán học</option>
                    <option value="vietnamese">Tiếng Việt</option>
                    <option value="science">Khoa học</option>
                    <option value="history_geo">Lịch sử & Địa lí</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Loại tài nguyên:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none"
                  >
                    <option value="worksheet">Phiếu học tập (PDF)</option>
                    <option value="lesson_plan">Giáo án điện tử (DOCX)</option>
                    <option value="mindmap">Sơ đồ tư duy (PNG/PDF)</option>
                    <option value="video">Video bài giảng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mô tả chi tiết:</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Mô tả nội dung tài liệu..."
                  className="w-full bg-slate-50 border rounded-xl p-2.5 outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Lưu vào thư viện
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
