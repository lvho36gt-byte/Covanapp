import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, SAMPLE_LESSONS } from '../data/mockData';
import { Lesson, SubjectId, Question } from '../types';
import { soundManager } from '../services/soundEffects';
import { 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  Star, 
  RotateCcw,
  Bot
} from 'lucide-react';

export const LearningCornerPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { student, recordQuizAttempt, triggerCelebration } = useApp();
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('math');
  const [activeLessonId, setActiveLessonId] = useState<string>('math-401');
  const [currentStepTab, setCurrentStepTab] = useState<'warmup' | 'explore' | 'practice' | 'apply' | 'self_eval'>('warmup');
  
  // Warm-up riddle reveal
  const [showRiddleHint, setShowRiddleHint] = useState(false);
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);

  // Practice state
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Self assessment stars
  const [selfRatings, setSelfRatings] = useState<{ [idx: number]: number }>({ 0: 3, 1: 3, 2: 3 });

  const activeSubject = SUBJECTS.find(s => s.id === selectedSubjectId) || SUBJECTS[0];
  const subjectLessons = SAMPLE_LESSONS.filter(l => l.subjectId === selectedSubjectId);
  const activeLesson = SAMPLE_LESSONS.find(l => l.id === activeLessonId) || subjectLessons[0] || SAMPLE_LESSONS[0];

  const handleSubjectChange = (subId: SubjectId) => {
    soundManager.playClick();
    setSelectedSubjectId(subId);
    const matched = SAMPLE_LESSONS.filter(l => l.subjectId === subId);
    if (matched.length > 0) {
      setActiveLessonId(matched[0].id);
    }
    // Reset states
    setCurrentStepTab('warmup');
    setShowRiddleHint(false);
    setShowRiddleAnswer(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizScore(null);
  };

  const handleLessonChange = (lessonId: string) => {
    soundManager.playClick();
    setActiveLessonId(lessonId);
    setCurrentStepTab('warmup');
    setShowRiddleHint(false);
    setShowRiddleAnswer(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    soundManager.playClick();
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitPractice = () => {
    if (isSubmitted) return;
    soundManager.playClick();

    const questions = activeLesson.practiceQuestions;
    let correctCount = 0;
    const improved: string[] = [];
    const needSupport: string[] = [];

    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
        improved.push(q.objective);
      } else {
        needSupport.push(q.objective);
      }
    });

    const scoreOutOf10 = Math.round((correctCount / questions.length) * 10);
    setQuizScore(scoreOutOf10);
    setIsSubmitted(true);

    if (scoreOutOf10 >= 7) {
      triggerCelebration();
    } else {
      soundManager.playIncorrect();
    }

    recordQuizAttempt({
      studentId: student.id,
      lessonId: activeLesson.id,
      subjectId: activeLesson.subjectId,
      score: scoreOutOf10,
      totalQuestions: questions.length,
      feedback: scoreOutOf10 >= 8
        ? 'Rất xuất sắc! Em đã nắm vững kiến thức trọng tâm của bài.'
        : 'Em đã nỗ lực làm bài tốt. Hãy đọc lại gợi ý giải thích để hiểu bài sâu hơn nhé!',
      improvedAspects: improved,
      needsSupportAspects: needSupport,
    });
  };

  const resetPractice = () => {
    soundManager.playClick();
    setUserAnswers({});
    setIsSubmitted(false);
    setQuizScore(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Phân hệ 1 & 2 • Học cùng AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
            Góc Học Tập Thông Minh & Cá Nhân Hóa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cấu trúc 5 bước chuẩn GDPT 2018: Khởi động ➔ Khám phá ➔ Luyện tập ➔ Vận dụng ➔ Tự đánh giá.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('textbooks')}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-2xl text-xs font-bold text-indigo-800 transition-colors"
            title="Xem phân phối chương trình 35 tuần và sách giáo khoa điện tử"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>SGK 35 Tuần (NXBGD)</span>
          </button>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-2xl text-xs font-bold text-amber-800">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{student.name} • {student.adaptiveLevel[activeLesson.subjectId as keyof typeof student.adaptiveLevel] || 'Thông hiểu'}</span>
          </div>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {SUBJECTS.map(sub => {
          const isSelected = sub.id === selectedSubjectId;
          return (
            <button
              key={sub.id}
              onClick={() => handleSubjectChange(sub.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{sub.id === 'math' ? '🔢' : sub.id === 'vietnamese' ? '📖' : sub.id === 'science' ? '🧪' : sub.id === 'history_geo' ? '🧭' : sub.id === 'ethics' ? '❤️' : '💻'}</span>
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lesson Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider text-blue-600 flex items-center justify-between">
              <span>Danh mục bài học</span>
              <span className="text-xs font-semibold text-slate-400">Lớp 4B</span>
            </h3>

            <div className="space-y-2">
              {subjectLessons.map(lesson => {
                const isCurrent = lesson.id === activeLesson.id;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonChange(lesson.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs ring-1 ring-blue-300'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>Tuần {lesson.week}</span>
                      <span>{lesson.durationMinutes} phút</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm leading-snug">
                      {lesson.title}
                    </h4>
                  </div>
                );
              })}

              {subjectLessons.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p>Cô Cẩm Vân đang cập nhật thêm bài học cho môn này.</p>
                  <p className="text-blue-600 font-semibold mt-1">Vui lòng chọn môn Toán, Tiếng Việt hoặc Khoa học để trải nghiệm ngay!</p>
                </div>
              )}
            </div>

            {/* Quick Helper Button to Robot Tutor */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('robot-tutor')}
                className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl font-bold text-xs shadow-sm transition-transform active:scale-95"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>Hỏi Robot Bạn Học về bài này</span>
              </button>
            </div>
          </div>

          {/* Objectives Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 space-y-2.5">
            <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mục tiêu đạt được (YCCĐ):</span>
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5">
              {activeLesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-black">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: 5-Step Lesson Viewer */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
            {[
              { id: 'warmup', label: '1. Khởi động', icon: '⚡' },
              { id: 'explore', label: '2. Khám phá', icon: '🔍' },
              { id: 'practice', label: '3. Luyện tập', icon: '📝' },
              { id: 'apply', label: '4. Vận dụng', icon: '🌍' },
              { id: 'self_eval', label: '5. Tự đánh giá', icon: '⭐' },
            ].map(tab => {
              const active = currentStepTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentStepTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    active
                      ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            {/* STEP 1: KHỞI ĐỘNG */}
            {currentStepTab === 'warmup' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Câu đố vui kích hoạt tư duy mở đầu bài học:</span>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 p-6 rounded-2xl space-y-4">
                  <p className="text-base sm:text-lg font-extrabold text-slate-800 leading-relaxed">
                    {activeLesson.warmup.riddle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setShowRiddleHint(!showRiddleHint);
                      }}
                      className="px-4 py-2 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors"
                    >
                      {showRiddleHint ? 'Ẩn gợi ý' : '💡 Xem gợi ý của Robot'}
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setShowRiddleAnswer(!showRiddleAnswer);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {showRiddleAnswer ? 'Ẩn đáp án' : '🔑 Mở đáp án bí mật'}
                    </button>
                  </div>

                  {showRiddleHint && (
                    <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 text-xs text-amber-900 animate-fadeIn">
                      <strong>Gợi ý:</strong> {activeLesson.warmup.hint}
                    </div>
                  )}

                  {showRiddleAnswer && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold animate-fadeIn">
                      🎉 <strong>Đáp án đúng:</strong> {activeLesson.warmup.answer}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentStepTab('explore');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    <span>Sang bước Khám phá</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: KHÁM PHÁ */}
            {currentStepTab === 'explore' && (
              <div className="space-y-6">
                <div className="space-y-6">
                  {activeLesson.exploration.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <h4 className="font-extrabold text-base text-blue-800">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {step.content}
                      </p>

                      {step.visualContent && (
                        <div className="p-4 bg-white rounded-xl border border-blue-200 text-center font-bold text-xs sm:text-sm text-blue-700 shadow-xs">
                          {step.visualContent}
                        </div>
                      )}

                      {step.tips && (
                        <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl space-y-1 text-xs text-sky-900">
                          <p className="font-bold">📌 Điểm cần ghi nhớ:</p>
                          {step.tips.map((t, ti) => (
                            <p key={ti}>• {t}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setCurrentStepTab('warmup')}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                  >
                    ← Quay lại Khởi động
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentStepTab('practice');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    <span>Sang bước Luyện tập (Làm bài)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LUYỆN TẬP */}
            {currentStepTab === 'practice' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500">
                    Gồm {activeLesson.practiceQuestions.length} câu hỏi thích ứng (Nhận biết - Thông hiểu - Vận dụng)
                  </span>
                  {quizScore !== null && (
                    <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1 rounded-xl">
                      Điểm: {quizScore}/10
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {activeLesson.practiceQuestions.map((q, idx) => {
                    const selected = userAnswers[q.id];
                    const isCorrect = selected === q.correctAnswer;

                    return (
                      <div key={q.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-bold text-blue-700">Câu {idx + 1}</span>
                          <span className="bg-white border px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600">
                            Mức: {q.cognitiveLevel}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                          {q.question}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options?.map((opt, oi) => {
                            const isOptSelected = selected === opt;
                            let btnStyle = 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700';

                            if (isSubmitted) {
                              if (opt === q.correctAnswer) {
                                btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                              } else if (isOptSelected) {
                                btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                              } else {
                                btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                              }
                            } else if (isOptSelected) {
                              btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-300 font-bold';
                            }

                            return (
                              <button
                                key={oi}
                                disabled={isSubmitted}
                                onClick={() => handleSelectOption(q.id, opt)}
                                className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation after submission */}
                        {isSubmitted && (
                          <div className={`p-3 rounded-xl text-xs space-y-1 ${
                            isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'
                          }`}>
                            <p className="font-bold">
                              {isCorrect ? '✓ Đúng rồi!' : '✗ Chưa chính xác. Lời giải của Robot Bạn Học:'}
                            </p>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit action */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitPractice}
                      disabled={Object.keys(userAnswers).length === 0}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all text-sm"
                    >
                      NỘP BÀI & CHẤM ĐIỂM
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={resetPractice}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Làm lại bài này</span>
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setCurrentStepTab('apply');
                        }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                      >
                        Sang bước Vận dụng ➜
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: VẬN DỤNG */}
            {currentStepTab === 'apply' && (
              <div className="space-y-6">
                <div className="bg-purple-50/70 border border-purple-200 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>Tình huống thực tế cuộc sống:</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeLesson.application.realLifeScenario}
                  </p>

                  <div className="p-4 bg-white rounded-xl border border-purple-200 space-y-2">
                    <h5 className="font-bold text-xs text-purple-900">🎯 Thử thách mở rộng dành cho em:</h5>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium">
                      {activeLesson.application.challengeTask}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setCurrentStepTab('practice')}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                  >
                    ← Quay lại Luyện tập
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentStepTab('self_eval');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    <span>Sang bước Tự đánh giá</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: TỰ ĐÁNH GIÁ */}
            {currentStepTab === 'self_eval' && (
              <div className="space-y-6">
                <div className="bg-teal-50/70 border border-teal-200 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-teal-900 text-sm">
                    Em hãy tự đánh giá mức độ hiểu bài hôm nay nhé:
                  </h4>

                  <div className="space-y-3">
                    {activeLesson.selfAssessment.questions.map((qText, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-slate-700 font-medium">{qText}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map(val => (
                            <button
                              key={val}
                              onClick={() => {
                                soundManager.playClick();
                                setSelfRatings(prev => ({ ...prev, [idx]: val }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                selfRatings[idx] === val
                                  ? 'bg-amber-400 text-slate-900 shadow-xs scale-105'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {val === 1 ? 'Chưa tự tin 😐' : val === 2 ? 'Khá hiểu 🙂' : 'Rất hiểu bài! 😃'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white/90 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-1">
                    <p className="font-bold">🌟 Đề xuất thích ứng tiếp theo từ AI:</p>
                    <p>
                      Dựa trên kết quả bài học, Robot Bạn Học đề xuất bạn thử sức với trò chơi <strong>AI Hái Hoa Tri Thức</strong> hoặc sáng tác một đoạn văn ngắn trong <strong>Góc Sáng Tạo</strong> nhé!
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('games')}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
                  >
                    Khám phá trò chơi liên quan 🎮
                  </button>

                  <button
                    onClick={() => onNavigate('progress')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                  >
                    Xem tiến bộ của em 📈
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
