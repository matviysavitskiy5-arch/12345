
export type SubjectCategory = 'STEM' | 'HUMANITIES' | 'SCIENCE' | 'LANG_LIT';

export interface QuizResult {
  topicId: string;
  subjectId: string;
  score: number;      // Raw score (e.g. 10 correct)
  totalQuestions: number; // Total (e.g. 12)
  grade: number;      // 1-12 scale grade
  date: string;
  timeSpent: number;  // in seconds
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  grade: number; // 5-11
  xp: number;
  level: number;
  streak: number;
  lastLoginDate?: string;
  lastActiveTimestamp?: number; // For real-time online status (epoch ms)
  completedTopics: string[]; // Topic IDs
  quizResults: QuizResult[]; 
  badges: string[];
  preferredStyle: LearningStyle;
  avatar?: string;
}

export interface PublicUser {
  id: string;
  username: string;
  grade: number;
  level: number;
  xp: number;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: PublicUser;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string; // Base content
  quizQuestions: QuizQuestion[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
}

export interface GradeLevel {
  grade: number;
  subjects: Subject[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export enum LearningStyle {
  SCHOOL = "Шкільний (Стандартний)",
  SIMPLIFIED = "Спрощений (Для початківців)",
  STORYTELLING = "Сторітелінг (Історії)",
  ANALOGY = "Аналогії (На прикладах з життя)",
  MAGICAL = "Магічний (Світ Чарівників 🧙‍♂️)",
  UNIVERSITY = "Університетський (Погливедени)"
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum HomeworkStatus {
  NOT_STARTED = "Не розпочато",
  IN_PROGRESS = "У процесі",
  SUBMITTED = "На перевірці",
  COMPLETED = "Виконано"
}

export interface HomeworkAssignment {
  id: string;
  subjectId: string;
  subjectName: string;
  topicTitle: string;
  description?: string;
  dueDate: string;
  status: HomeworkStatus;
  difficulty: 'Легкий' | 'Середній' | 'Складний';
  xpReward: number;
  
  // Submission fields
  studentAnswer?: string;
  teacherFeedback?: string;
  grade?: number; // 1-12
  completedAt?: string;
}

export interface HomeworkOption {
  title: string;
  description: string;
  difficulty: 'Легкий' | 'Середній' | 'Складний';
  xpReward: number;
}

export interface TaskStructure {
  id: string;
  category: SubjectCategory;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'textarea';
  }[];
}