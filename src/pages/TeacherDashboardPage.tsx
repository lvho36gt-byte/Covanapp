import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQuestionsByAi } from '../services/geminiService';
import { soundManager } from '../services/soundEffects';
import { Question, SubjectId, CognitiveLevel, StudentProfile } from '../types';
import { 
  GraduationCap, 
  Sparkles, 
  Plus, 
  Check, 
  Trash2, 
  Printer, 
  FileText, 
  Users, 
  CheckCircle2, 
  Edit3, 
  ShieldCheck,
  Download,
  UserPlus,
  Award
} from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const { 
    teacherQuestions, 
    approveTeacherQuestion, 
    addTeacherQuestion, 
    deleteTeacherQuestion, 
    triggerCelebration,
    students,
    activeStudentId,
    selectStudent,
    addStudent,
    deleteStudent
  } = useApp();

  const [activeTab, setActiveTab] = useState<'workshop' | 'bank' | 'students'>('workshop');

  // Generator form
  const [subject, setSubject] = useState('Toán học');
  const [topic, setTopic] = useState('Các phép tính với số có nhiều chữ số');
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>('Thông hiểu');
  const [questionType, setQuestionType] = useState('Trắc nghiệm 4 lựa chọn');
  const [count, setCount] = useState(2);
  const [teacherNotes, setTeacherNotes] = useState('Gắn với tình huống thực tế tại Hưng Yên hoặc huyện Khoái Châu.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<Question[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Add student form state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState('👦');
  const [newStudentNote, setNewStudentNote] = useState('');

  const handleGenerateQuestions = async () => {
    soundManager.playClick();
    setIsGenerating(true);

    try {
      const { questions } = await generateQuestionsByAi({
        subject,
        topic,
        cognitiveLevel,
        questionType,
        count,
        teacherNotes,
      });

      const formatted: Question[] = questions.map((q: any, idx: number) => ({
        id: `ai-gen-${Date.now()}-${idx}`,
        subjectId: (subject === 'Toán học' ? 'math' : subject === 'Tiếng Việt' ? 'vietnamese' : 'science') as SubjectId,
        topicId: 'custom-topic',
        question: q.question,
        type: 'multiple-choice',
        options: q.options || ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
        correctAnswer: q.correctAnswer || (q.options ? q.options[0] : 'A'),
        explanation: q.explanation || 'Giải thích sư phạm chuẩn GDPT 2018.',
        cognitiveLevel: (q.cognitiveLevel || cognitiveLevel) as CognitiveLevel,
        objective: q.objective || `Chuẩn yêu cầu cần đạt môn ${subject}.`,
        isAiGenerated: true,
        isApprovedByTeacher: false,
      }));

      setGeneratedDrafts(formatted);
      soundManager.playCorrect();
    } catch {
      alert('Không thể tạo tự động lúc này. Hãy thử lại hoặc dùng ngân hàng câu hỏi có sẵn.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveDraft = (q: Question) => {
    soundManager.playClick();
    const approved: Question = { ...q, isApprovedByTeacher: true };
    addTeacherQuestion(approved);
    setGeneratedDrafts(prev => prev.filter(item => item.id !== q.id));
    triggerCelebration();
  };

  const handleApproveAll = () => {
    soundManager.playCorrect();
    generatedDrafts.forEach(q => {
      addTeacherQuestion({ ...q, isApprovedByTeacher: true });
    });
    setGeneratedDrafts([]);
    triggerCelebration();
  };

  const handleAddNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    addStudent({
      name: newStudentName.trim(),
      studentCode: newStudentCode.trim() || undefined,
      avatar: newStudentAvatar,
      note: newStudentNote.trim() || undefined,
    });

    setNewStudentName('');
    setNewStudentCode('');
    setNewStudentNote('');
    setShowAddStudentModal(false);
  };

  const handleDeleteStudentClick = (studentItem: StudentProfile) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${studentItem.name}" (${studentItem.studentCode}) khỏi danh sách lớp 4B?`)) {
      deleteStudent(studentItem.id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Phân hệ 5 • Xưởng Sáng Tạo Học Liệu AI & Quản Lý Giáo Viên
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Bảng Quản Trị Giáo Viên</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Cô Nguyễn Thị Cẩm Vân • Lớp 4B
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Giáo viên giữ quyền chủ động thiết kế, thẩm định 100% học liệu và quản lý danh sách học sinh Lớp 4B.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('workshop')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all ${
              activeTab === 'workshop' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤖 Xưởng tạo đề AI
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bank' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📚 Ngân hàng đề ({teacherQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'students' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Quản lý học sinh ({students.length})</span>
          </button>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Cam kết sư phạm:</strong> Mọi câu hỏi do AI gợi ý đều ở trạng thái "Chờ giáo viên duyệt". Học sinh chỉ được tiếp cận các bài tập đã được cô Cẩm Vân phê duyệt chính thức.
        </span>
      </div>

      {/* WORKSHOP TAB */}
      {activeTab === 'workshop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Generator Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Thiết Lập Yêu Cầu Học Liệu AI</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Môn học:</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-semibold text-slate-800"
                >
                  <option value="Toán học">Toán học (Lớp 4)</option>
                  <option value="Tiếng Việt">Tiếng Việt (Lớp 4)</option>
                  <option value="Khoa học">Khoa học (Lớp 4)</option>
                  <option value="Lịch sử & Địa lí">Lịch sử & Địa lí (Lớp 4)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Chủ đề bài học:</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Nhập chủ đề bài dạy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Mức độ nhận thức:</label>
                  <select
                    value={cognitiveLevel}
                    onChange={e => setCognitiveLevel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Số lượng câu:</label>
                  <select
                    value={count}
                    onChange={e => setCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value={1}>1 câu</option>
                    <option value={2}>2 câu</option>
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Ghi chú sư phạm (Tùy chọn):</label>
                <textarea
                  value={teacherNotes}
                  onChange={e => setTeacherNotes(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Gắn với bối cảnh địa phương huyện Khoái Châu, dùng từ ngữ gợi cảm..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 leading-relaxed"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'AI đang soạn câu hỏi chuẩn GDPT...' : 'TẠO CÂU HỎI BẰNG AI'}</span>
              </button>
            </div>
          </div>

          {/* Right: Review & Approval Area */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-800">
                Bản Dự Thảo Đang Chờ Cô Duyệt ({generatedDrafts.length})
              </h3>

              {generatedDrafts.length > 0 && (
                <button
                  onClick={handleApproveAll}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Duyệt tất cả ({generatedDrafts.length})</span>
                </button>
              )}
            </div>

            {generatedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white p-5 rounded-3xl border border-blue-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-lg">
                    Chờ duyệt • {draft.cognitiveLevel}
                  </span>
                  <span className="text-slate-400 font-medium">{draft.objective}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-800 leading-snug">
                  {draft.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {draft.options?.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`p-2.5 rounded-xl border ${
                        opt === draft.correctAnswer
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt} {opt === draft.correctAnswer && ' (Đáp án đúng)'}
                    </div>
                  ))}
                </div>

                <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 text-xs text-sky-950">
                  <strong>💡 Giải thích sư phạm:</strong> {draft.explanation}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setGeneratedDrafts(prev => prev.filter(d => d.id !== draft.id))}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleApproveDraft(draft)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Phê duyệt & Đưa vào đề</span>
                  </button>
                </div>
              </div>
            ))}

            {generatedDrafts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
                <Sparkles className="w-8 h-8 text-blue-300 mx-auto" />
                <p className="font-semibold text-slate-700">Chưa có câu hỏi dự thảo mới.</p>
                <p>Hãy chọn thông số bên trái và bấm <strong>"TẠO CÂU HỎI BẰNG AI"</strong> để xem các câu hỏi đề xuất nhé!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUESTION BANK TAB */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-base text-slate-800">
                Ngân Hàng Câu Hỏi Đã Phê Duyệt ({teacherQuestions.length})
              </h3>
              <p className="text-xs text-slate-500">
                Các câu hỏi này đã sẵn sàng để giao cho học sinh Lớp 4B hoặc xuất in phiếu A4.
              </p>
            </div>

            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Xuất Phiếu Bài Tập In A4</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Đã phê duyệt</span>
                    </span>
                    <span className="text-slate-400 font-semibold">{q.cognitiveLevel}</span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                    {idx + 1}. {q.question}
                  </h4>

                  <div className="space-y-1 text-xs">
                    {q.options?.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`p-2 rounded-lg ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[200px]">{q.objective}</span>
                  <button
                    onClick={() => deleteTeacherQuestion(q.id)}
                    className="hover:text-rose-600 transition-colors p-1"
                    title="Xóa câu hỏi khỏi ngân hàng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENTS LIST MANAGEMENT TAB */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Quản Lý Danh Sách Học Sinh Lớp 4B</span>
              </h3>
              <p className="text-xs text-slate-500">
                Trường Tiểu học Khoái Châu 1 • Năm học 2026 • GVCN: Nguyễn Thị Cẩm Vân
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200">
                Sĩ số: {students.length} em
              </span>

              {/* Nút thêm học sinh */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowAddStudentModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-transform active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ THÊM HỌC SINH</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3">Mã số</th>
                  <th className="pb-3">Họ và tên</th>
                  <th className="pb-3">Điểm tích lũy</th>
                  <th className="pb-3">Nhóm năng lực thích ứng</th>
                  <th className="pb-3">Ghi chú sư phạm</th>
                  <th className="pb-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const isActive = st.id === activeStudentId;
                  return (
                    <tr key={st.id} className={`transition-colors ${isActive ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}>
                      <td className="py-3.5">
                        {isActive ? (
                          <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
                            <Check className="w-2.5 h-2.5" />
                            <span>Đang chọn</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => selectStudent(st.id)}
                            className="text-[11px] text-blue-600 hover:underline font-bold"
                          >
                            Chọn học
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 font-semibold text-slate-500">{st.studentCode}</td>
                      <td className="py-3.5 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{st.avatar}</span>
                          <span className="text-sm">{st.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-black text-amber-600">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{st.points}đ</span>
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-blue-700">
                        <span className="bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                          {st.adaptiveLevel.math} / {st.adaptiveLevel.vietnamese}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 max-w-[200px] truncate">{st.note || '—'}</td>
                      <td className="py-3.5 text-right">
                        {/* Nút xóa học sinh */}
                        <button
                          onClick={() => handleDeleteStudentClick(st)}
                          disabled={students.length <= 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg hover:bg-rose-50 transition-colors"
                          title={`Xóa học sinh ${st.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL THÊM HỌC SINH MỚI */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddNewStudentSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Thêm Học Sinh Mới Vào Lớp 4B</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Họ và tên học sinh (*):</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="Ví dụ: Đỗ Gia Hưng, Bùi Ngọc Anh..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 outline-none font-semibold text-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Mã số học sinh:</label>
                  <input
                    type="text"
                    value={newStudentCode}
                    onChange={e => setNewStudentCode(e.target.value)}
                    placeholder="Tự động nếu để trống"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Biểu tượng / Avatar:</label>
                  <select
                    value={newStudentAvatar}
                    onChange={e => setNewStudentAvatar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 outline-none font-bold"
                  >
                    <option value="👦">👦 Bé trai</option>
                    <option value="👧">👧 Bé gái</option>
                    <option value="⭐">⭐ Ngôi sao</option>
                    <option value="🚀">🚀 Phi hành gia</option>
                    <option value="🌱">🌱 Mầm xanh</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Ghi chú nhận xét của giáo viên:</label>
                <textarea
                  value={newStudentNote}
                  onChange={e => setNewStudentNote(e.target.value)}
                  rows={2}
                  placeholder="Ví dụ: Năng khiếu toán học, cần rèn thêm chính tả..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                Lưu Học Sinh
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRINTABLE A4 WORKSHEET MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl relative my-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="font-black text-slate-800 text-sm">
                Xem Trước & Xuất Phiếu Bài Tập Khổ A4
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Phiếu A4</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* A4 Sheet Content */}
            <div className="p-6 border border-slate-300 rounded-2xl space-y-6 font-serif">
              {/* Header */}
              <div className="text-center space-y-1 border-b border-slate-300 pb-4">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-600">
                  Phòng GD&ĐT Huyện Khoái Châu • Trường Tiểu học Khoái Châu 1
                </p>
                <h2 className="text-lg font-black text-slate-900 uppercase">
                  PHIẾU BÀI TẬP CUỐI TUẦN – LỚP 4B
                </h2>
                <p className="text-xs italic text-slate-600">
                  (Biên soạn theo chương trình GDPT 2018 • GVCN: Nguyễn Thị Cẩm Vân)
                </p>
                <div className="flex justify-between text-xs pt-2 text-slate-700 font-sans">
                  <span>Họ và tên học sinh: ............................................................</span>
                  <span>Điểm: ..................</span>
                </div>
              </div>

              {/* Questions list */}
              <div className="space-y-4 font-sans text-xs">
                {teacherQuestions.slice(0, 4).map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-bold text-slate-900 leading-snug">
                      Câu {idx + 1} ({q.cognitiveLevel}): {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {q.options?.map((opt, oi) => (
                        <div key={oi} className="text-slate-700">
                          {String.fromCharCode(65 + oi)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-600 italic">
                <span>Chúc các em làm bài chăm chỉ và tự tin!</span>
                <span>Cô giáo: Nguyễn Thị Cẩm Vân</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
