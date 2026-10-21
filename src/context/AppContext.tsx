import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, StudentProfile, QuizAttempt, CreativeWork, Question, ParentNote } from '../types';
import { INITIAL_STUDENTS, CURATED_QUESTION_BANK } from '../data/mockData';
import { soundManager } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  students: StudentProfile[];
  activeStudentId: string;
  student: StudentProfile;
  selectStudent: (studentId: string) => void;
  addStudent: (data: { name: string; studentCode?: string; avatar?: string; note?: string }) => void;
  deleteStudent: (studentId: string) => void;
  quizAttempts: QuizAttempt[];
  creativeWorks: CreativeWork[];
  teacherQuestions: Question[];
  parentNotes: ParentNote[];
  isSoundMuted: boolean;
  toggleSound: () => void;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  awardBadge: (badgeId: string) => void;
  addCreativeWork: (work: Omit<CreativeWork, 'id' | 'createdAt' | 'studentId' | 'studentName'>) => void;
  updateCreativeWork: (id: string, updates: Partial<CreativeWork>) => void;
  approveTeacherQuestion: (questionId: string) => void;
  addTeacherQuestion: (question: Question) => void;
  deleteTeacherQuestion: (questionId: string) => void;
  sendParentMessage: (message: string) => void;
  replyParentMessage: (id: string, reply: string) => void;
  triggerCelebration: () => void;
  resetDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'ai_companion_role_v2',
  STUDENTS: 'ai_companion_students_v2',
  ACTIVE_STUDENT: 'ai_companion_active_student_v2',
  ATTEMPTS: 'ai_companion_attempts_v2',
  CREATIVE: 'ai_companion_creative_v2',
  QUESTIONS: 'ai_companion_questions_v2',
  NOTES: 'ai_companion_notes_v2',
  MUTED: 'ai_companion_muted_v2',
};

const INITIAL_CREATIVE_WORKS: CreativeWork[] = [
  {
    id: 'cw-1',
    studentId: 'hs-01',
    studentName: 'Trần Bảo Trâm',
    type: 'story',
    title: 'Chú Robot Bạn Học đến thăm vườn nhãn Khoái Châu',
    content: 'Một buổi sáng mùa thu trong lành, tớ cùng chú Robot Bạn Học nắm tay nhau đi dạo bên rặng nhãn lồng chín thơm. Chú Robot chớp chớp mắt hỏi tớ: "Trâm ơi, vì sao quả nhãn lại mọng nước và ngọt thế này nhỉ?". Tớ liền nhớ đến bài học về Vòng tuần hoàn của nước và cây xanh, hào hứng giải thích cho Robot nghe...',
    aiFeedback: 'Câu chuyện rất ấm áp, giàu tình cảm quê hương! Em biết vận dụng kiến thức khoa học vào câu văn mượt mà.',
    teacherGrade: 'A+',
    teacherComment: 'Cô khen Bảo Trâm có trí tưởng tượng rất phong phú và diễn đạt trôi chảy!',
    createdAt: '2026-10-18',
    status: 'reviewed',
  },
  {
    id: 'cw-2',
    studentId: 'hs-01',
    studentName: 'Trần Bảo Trâm',
    type: 'mindmap',
    title: 'Sơ đồ tư duy: Gia đình từ ngữ chỉ Phẩm chất người học sinh 4B',
    content: 'Trung tâm: Học sinh 4B tiêu biểu -> Nhánh 1: Chăm chỉ (Cần cù, siêng năng) -> Nhánh 2: Trung thực (Thật thà, thẳng thắn) -> Nhánh 3: Dũng cảm (Tự tin phát biểu, dám nhận lỗi) -> Nhánh 4: Yêu thương (Giúp đỡ bạn bè).',
    aiFeedback: 'Bố cục sơ đồ rất logic, phân chia nhánh rõ ràng theo đúng bài học Luyện từ và câu!',
    createdAt: '2026-10-19',
    status: 'submitted',
  },
];

const INITIAL_PARENT_NOTES: ParentNote[] = [
  {
    id: 'pn-1',
    studentId: 'hs-01',
    senderName: 'Phụ huynh bé Bảo Trâm',
    message: 'Chào cô Cẩm Vân ạ! Mấy hôm nay về nhà con rất hào hứng mở ứng dụng học bài và đố bố mẹ về các hàng, các lớp. Nhờ có Robot Bạn Học gợi ý từng bước mà con không còn sợ giải toán có lời văn nữa.',
    date: '2026-10-19',
    replyFromTeacher: 'Cảm ơn phụ huynh! Bảo Trâm trên lớp tuần này tiến bộ rõ rệt, đặc biệt là sự tự tin khi lên bảng chia sẻ cách giải bài toán. Gia đình hãy tiếp tục động viên con nhé!',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'student';
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
    return saved || INITIAL_STUDENTS[0].id;
  });

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0] || INITIAL_STUDENTS[0];

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'att-01',
        studentId: 'hs-01',
        lessonId: 'math-401',
        subjectId: 'math',
        score: 10,
        totalQuestions: 3,
        completedAt: '2026-10-19 15:30',
        feedback: 'Xuất sắc! Em đã nắm vững cấu tạo hàng và lớp của số có 6 chữ số.',
        improvedAspects: ['Đọc viết số chính xác', 'Xác định đúng giá trị chữ số'],
        needsSupportAspects: [],
      },
    ];
  });

  const [creativeWorks, setCreativeWorks] = useState<CreativeWork[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CREATIVE);
    return saved ? JSON.parse(saved) : INITIAL_CREATIVE_WORKS;
  });

  const [teacherQuestions, setTeacherQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return saved ? JSON.parse(saved) : CURATED_QUESTION_BANK;
  });

  const [parentNotes, setParentNotes] = useState<ParentNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : INITIAL_PARENT_NOTES;
  });

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
  });

  // Keep soundManager synced
  useEffect(() => {
    soundManager.isMuted = isSoundMuted;
    localStorage.setItem(STORAGE_KEYS.MUTED, isSoundMuted ? 'true' : 'false');
  }, [isSoundMuted]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREATIVE, JSON.stringify(creativeWorks));
  }, [creativeWorks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(teacherQuestions));
  }, [teacherQuestions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(parentNotes));
  }, [parentNotes]);

  const toggleSound = () => {
    setIsSoundMuted(prev => !prev);
  };

  const triggerCelebration = () => {
    soundManager.playSuccessFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1765D1', '#36B8C5', '#FFD65A', '#FFB9DC', '#A991F7'],
    });
  };

  const selectStudent = (studentId: string) => {
    soundManager.playClick();
    setActiveStudentId(studentId);
  };

  const addStudent = (data: { name: string; studentCode?: string; avatar?: string; note?: string }) => {
    soundManager.playCorrect();
    const newId = `hs-${Date.now()}`;
    const studentCount = students.length + 1;
    const newStudent: StudentProfile = {
      id: newId,
      name: data.name.trim(),
      studentCode: data.studentCode?.trim() || `KC1-4B-${studentCount < 10 ? '0' + studentCount : studentCount}`,
      avatar: data.avatar || (studentCount % 2 === 0 ? '👦' : '👧'),
      grade: 'Lớp 4',
      className: '4B',
      school: 'Trường Tiểu học Khoái Châu 1',
      teacherName: 'Nguyễn Thị Cẩm Vân',
      points: 100,
      streakDays: 1,
      badges: ['badge-effort'],
      adaptiveLevel: {
        math: 'Thông hiểu',
        vietnamese: 'Thông hiểu',
        science: 'Thông hiểu',
      },
      note: data.note || 'Học sinh mới thêm vào lớp 4B',
    };

    setStudents(prev => [...prev, newStudent]);
    setActiveStudentId(newId);
    triggerCelebration();
  };

  const deleteStudent = (studentId: string) => {
    soundManager.playClick();
    if (students.length <= 1) {
      alert('Lớp học cần có ít nhất 1 học sinh!');
      return;
    }
    const remaining = students.filter(s => s.id !== studentId);
    setStudents(remaining);
    if (activeStudentId === studentId) {
      setActiveStudentId(remaining[0].id);
    }
  };

  const awardBadge = (badgeId: string) => {
    if (!activeStudent.badges.includes(badgeId)) {
      setStudents(prev =>
        prev.map(s =>
          s.id === activeStudent.id
            ? { ...s, badges: [...s.badges, badgeId], points: s.points + 50 }
            : s
        )
      );
      triggerCelebration();
    }
  };

  const recordQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      completedAt: new Date().toLocaleString('vi-VN'),
    };

    setQuizAttempts(prev => [newAttempt, ...prev]);

    // Update student points and check adaptive levels
    const earnedPoints = attemptData.score * 10;
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== activeStudent.id) return s;
        let updatedAdaptive = { ...s.adaptiveLevel };
        if (attemptData.score >= 8) {
          if (updatedAdaptive[attemptData.subjectId as keyof typeof updatedAdaptive] === 'Nhận biết') {
            updatedAdaptive[attemptData.subjectId as keyof typeof updatedAdaptive] = 'Thông hiểu';
          } else if (updatedAdaptive[attemptData.subjectId as keyof typeof updatedAdaptive] === 'Thông hiểu') {
            updatedAdaptive[attemptData.subjectId as keyof typeof updatedAdaptive] = 'Vận dụng';
          } else if (updatedAdaptive[attemptData.subjectId as keyof typeof updatedAdaptive] === 'Vận dụng') {
            updatedAdaptive[attemptData.subjectId as keyof typeof updatedAdaptive] = 'Vận dụng cao';
          }
        }
        return {
          ...s,
          points: s.points + earnedPoints,
          adaptiveLevel: updatedAdaptive,
        };
      })
    );

    if (attemptData.score >= 7) {
      awardBadge('badge-progress');
    }
  };

  const addCreativeWork = (work: Omit<CreativeWork, 'id' | 'createdAt' | 'studentId' | 'studentName'>) => {
    const newWork: CreativeWork = {
      ...work,
      id: `cw-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCreativeWorks(prev => [newWork, ...prev]);
    setStudents(prev =>
      prev.map(s => (s.id === activeStudent.id ? { ...s, points: s.points + 30 } : s))
    );
    awardBadge('badge-creativity');
  };

  const updateCreativeWork = (id: string, updates: Partial<CreativeWork>) => {
    setCreativeWorks(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  const approveTeacherQuestion = (questionId: string) => {
    setTeacherQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, isApprovedByTeacher: true } : q))
    );
  };

  const addTeacherQuestion = (question: Question) => {
    setTeacherQuestions(prev => [question, ...prev]);
  };

  const deleteTeacherQuestion = (questionId: string) => {
    setTeacherQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const sendParentMessage = (message: string) => {
    const newNote: ParentNote = {
      id: `pn-${Date.now()}`,
      studentId: activeStudent.id,
      senderName: 'Phụ huynh bé ' + activeStudent.name,
      message,
      date: new Date().toISOString().split('T')[0],
    };
    setParentNotes(prev => [newNote, ...prev]);
  };

  const replyParentMessage = (id: string, reply: string) => {
    setParentNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, replyFromTeacher: reply } : note))
    );
  };

  const resetDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.CREATIVE);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    setStudents(INITIAL_STUDENTS);
    setActiveStudentId(INITIAL_STUDENTS[0].id);
    setCreativeWorks(INITIAL_CREATIVE_WORKS);
    setTeacherQuestions(CURATED_QUESTION_BANK);
    setParentNotes(INITIAL_PARENT_NOTES);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        students,
        activeStudentId,
        student: activeStudent,
        selectStudent,
        addStudent,
        deleteStudent,
        quizAttempts,
        creativeWorks,
        teacherQuestions,
        parentNotes,
        isSoundMuted,
        toggleSound,
        recordQuizAttempt,
        awardBadge,
        addCreativeWork,
        updateCreativeWork,
        approveTeacherQuestion,
        addTeacherQuestion,
        deleteTeacherQuestion,
        sendParentMessage,
        replyParentMessage,
        triggerCelebration,
        resetDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
