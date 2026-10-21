import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../services/soundEffects';
import { CreativeWork } from '../types';
import { Palette, Sparkles, Send, Save, BookOpen, CheckCircle, MessageSquare, Award } from 'lucide-react';

export const CreativeLabPage: React.FC = () => {
  const { student, creativeWorks, addCreativeWork, triggerCelebration } = useApp();
  const [activeTab, setActiveTab] = useState<'create' | 'portfolio'>('create');
  
  const [workType, setWorkType] = useState<'story' | 'mindmap' | 'picture_story' | 'ai_challenge'>('story');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiTip, setAiTip] = useState<string | null>(null);

  const creativePrompts = [
    {
      type: 'story',
      title: 'Chuyến phiêu lưu đến vườn nhãn Khoái Châu cùng Robot Bạn Học',
      hint: 'Hãy tưởng tượng bạn và Robot đi thăm một vườn nhãn chín thơm, quan sát quả nhãn và kể lại cảm xúc của hai bạn.',
    },
    {
      type: 'picture_story',
      title: 'Một ngày làm Hiệp Sĩ Nước Sạch tại trường Khoái Châu 1',
      hint: 'Kể về hành động em và các bạn khóa vòi nước, bảo vệ nguồn nước sạch và cây xanh ở trường.',
    },
    {
      type: 'mindmap',
      title: 'Sơ đồ tư duy: Gia đình từ ngữ chỉ Phẩm chất người học sinh lớp 4',
      hint: 'Chia nhánh: Chăm chỉ, Trung thực, Dũng cảm, Trách nhiệm... kèm ví dụ hành động cụ thể.',
    },
    {
      type: 'ai_challenge',
      title: 'Em đặt câu đố vui ngược lại để thử tài Robot Bạn Học AI!',
      hint: 'Nghĩ ra một câu đố mẹo hoặc câu đố toán có lời văn thật hóc búa để đố lại Robot nhé!',
    },
  ];

  const handleAskAiIdea = () => {
    soundManager.playClick();
    if (workType === 'story') {
      setAiTip('💡 Gợi ý của Robot Bạn Học: Em có thể bắt đầu bằng một âm thanh vui tai (tiếng ve kêu, tiếng cười đùa...) hoặc một hình ảnh đẹp (ánh nắng sớm chiếu qua kẽ lá). Nhớ dùng thêm 2 từ ngữ gợi tả sinh động nhé!');
    } else if (workType === 'mindmap') {
      setAiTip('💡 Gợi ý sơ đồ tư duy: Ở trung tâm ghi từ khóa chính. Vẽ ít nhất 3 nhánh phụ với màu sắc khác nhau để dễ nhớ bài hơn nha!');
    } else {
      setAiTip('💡 Gợi ý sáng tạo: Hãy thoải mái thể hiện suy nghĩ chân thật của chính em. Mỗi ý tưởng của em đều rất đáng quý!');
    }
  };

  const handleSubmitWork = (status: 'draft' | 'submitted') => {
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung bài sáng tạo của em nhé!');
      return;
    }

    soundManager.playCorrect();
    addCreativeWork({
      type: workType,
      title: title.trim(),
      content: content.trim(),
      status,
      aiFeedback: 'Tác phẩm thể hiện tư duy phong phú và tinh thần tự học rất đáng khen!',
    });

    if (status === 'submitted') {
      triggerCelebration();
    }

    setTitle('');
    setContent('');
    setAiTip(null);
    setActiveTab('portfolio');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Phân hệ 6 • Phát triển năng lực sáng tạo
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Góc Sáng Tạo Của Em</span>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              Lớp 4B
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Không gian để học sinh tự viết truyện, vẽ sơ đồ tư duy và thử thách trí thông minh cùng AI!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'create' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✏️ Sáng tác bài mới
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'portfolio' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📂 Hồ sơ sáng tạo ({creativeWorks.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Work Type selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Chọn hình thức sáng tạo:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'story', label: 'Viết câu chuyện', icon: '📝' },
                  { id: 'picture_story', label: 'Kể chuyện tranh', icon: '🎨' },
                  { id: 'mindmap', label: 'Sơ đồ tư duy', icon: '🧠' },
                  { id: 'ai_challenge', label: 'Đố ngược lại AI', icon: '🤖' },
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setWorkType(type.id as any);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      workType === type.id
                        ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-200 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Tên bài viết / tác phẩm của em:
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Chuyến dạo chơi vườn nhãn cùng Robot Bạn Học..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl p-3.5 text-sm outline-none transition-all"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Nội dung bài làm của em:
                </label>
                <button
                  type="button"
                  onClick={handleAskAiIdea}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nhờ Robot gợi ý ý tưởng</span>
                </button>
              </div>

              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={8}
                placeholder="Em hãy thỏa sức viết những câu văn sinh động, miêu tả cảm xúc hoặc trình bày các nhánh sơ đồ tư duy nhé..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl p-4 text-sm outline-none transition-all leading-relaxed"
              ></textarea>
            </div>

            {aiTip && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 animate-fadeIn">
                {aiTip}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSubmitWork('draft')}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Lưu bản nháp</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmitWork('submitted')}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài cho cô Cẩm Vân (+30đ)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Suggested Topics */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200/80 space-y-4">
              <h4 className="font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Chủ đề gợi ý tuần này:</span>
              </h4>

              <div className="space-y-3">
                {creativePrompts.map((cp, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      soundManager.playClick();
                      setTitle(cp.title);
                      setWorkType(cp.type as any);
                    }}
                    className="p-3 bg-white/90 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all cursor-pointer shadow-2xs group"
                  >
                    <span className="font-bold text-xs text-purple-900 group-hover:text-purple-700 block leading-snug">
                      {cp.title}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                      {cp.hint}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Portfolio History View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {creativeWorks.map(work => (
              <div
                key={work.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                      {work.type === 'story' ? 'Câu chuyện ngắn' : work.type === 'mindmap' ? 'Sơ đồ tư duy' : work.type === 'picture_story' ? 'Kể chuyện tranh' : 'Thử thách AI'}
                    </span>
                    <span className="text-slate-400 font-medium">{work.createdAt}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800">
                    {work.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl line-clamp-4">
                    {work.content}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  {work.teacherGrade && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Đánh giá của cô Cẩm Vân:</strong> {work.teacherGrade} - {work.teacherComment}</span>
                    </div>
                  )}

                  {work.aiFeedback && (
                    <div className="text-[11px] text-purple-700 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                      🤖 <strong>Robot Bạn Học:</strong> {work.aiFeedback}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {creativeWorks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 text-xs">
              Chưa có tác phẩm nào. Hãy bấm sang mục "Sáng tác bài mới" để viết bài đầu tiên nhé!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
