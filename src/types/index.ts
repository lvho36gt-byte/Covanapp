export type UserRole = 'student' | 'teacher' | 'parent';

export type SubjectId = 
  | 'math'
  | 'vietnamese'
  | 'science'
  | 'history_geo'
  | 'ethics'
  | 'informatics'
  | 'technology'
  | 'experiential'
  | 'music'
  | 'arts'
  | 'pe'
  | 'english';

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  topicsCount: number;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  topicId: string;
  lessonId?: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  cognitiveLevel: CognitiveLevel;
  objective: string;
  isAiGenerated?: boolean;
  isApprovedByTeacher?: boolean;
}

export interface LessonStep {
  title: string;
  content: string;
  tips?: string[];
  visualType?: 'diagram' | 'formula' | 'story' | 'image';
  visualContent?: string;
}

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  topic: string;
  title: string;
  week: number;
  durationMinutes: number;
  objectives: string[];
  warmup: {
    riddle: string;
    hint: string;
    answer: string;
  };
  exploration: LessonStep[];
  practiceQuestions: Question[];
  application: {
    realLifeScenario: string;
    challengeTask: string;
  };
  selfAssessment: {
    questions: string[];
  };
}

export interface Badge {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'effort' | 'creativity' | 'progress' | 'perseverance' | 'collaboration';
}

export interface StudentProfile {
  id: string;
  name: string;
  studentCode: string;
  avatar: string;
  grade: string;
  className: string;
  school: string;
  teacherName: string;
  points: number;
  streakDays: number;
  badges: string[];
  adaptiveLevel: {
    math: CognitiveLevel;
    vietnamese: CognitiveLevel;
    science: CognitiveLevel;
  };
  note?: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  lessonId: string;
  subjectId: SubjectId;
  score: number;
  totalQuestions: number;
  completedAt: string;
  feedback: string;
  improvedAspects: string[];
  needsSupportAspects: string[];
}

export interface CreativeWork {
  id: string;
  studentId: string;
  studentName: string;
  type: 'story' | 'mindmap' | 'picture_story' | 'ai_challenge';
  title: string;
  content: string;
  aiFeedback?: string;
  teacherGrade?: string;
  teacherComment?: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'reviewed';
}

export interface ParentNote {
  id: string;
  studentId: string;
  senderName: string;
  message: string;
  date: string;
  replyFromTeacher?: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  subjectId: SubjectId;
  category: 'lesson_plan' | 'worksheet' | 'mindmap' | 'video' | 'interactive';
  format: 'PDF' | 'DOCX' | 'VIDEO' | 'INTERACTIVE';
  week: number;
  fileSize: string;
  downloadUrl?: string;
  description: string;
}

export interface SurveyComparison {
  criterion: string;
  beforeRate: number;
  afterRate: number;
  unit: string;
  note: string;
}

export interface TextbookInfo {
  id: string;
  subjectName: string;
  subjectId: SubjectId;
  bookSeries: string;
  publisher: string;
  totalWeeks: number; // 35 tuần
  officialUrl: string;
  coverColor: string;
  icon: string;
  description: string;
  semester1Weeks: string;
  semester2Weeks: string;
  sampleWeeklyPlan: Array<{
    week: number;
    title: string;
    keyKnowledge: string;
  }>;
}
