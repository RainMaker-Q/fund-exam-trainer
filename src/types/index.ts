export type Level = '掌握' | '理解' | '了解';

export interface Point {
  id: string;
  code: string;
  level: Level;
  title: string;
}

export interface Section {
  id: string;
  name: string;
  points: Point[];
}

export interface Chapter {
  id: string;
  name: string;
  sections: Section[];
}

export interface Subject {
  id: 'kemu1' | 'kemu2';
  name: string;
  shortName: string;
  chapters: Chapter[];
}

export interface Curriculum {
  version: string;
  source: string;
  studyOrder: string[];
  subjects: Subject[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subjectId: 'kemu1' | 'kemu2';
  pointCodes: string[];
  chapterId: string;
  type: 'single' | 'multi';
  stem: string;
  options: QuestionOption[];
  answer: string[];
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface WrongItem {
  questionId: string;
  selected: string[];
  timestamp: number;
  pointCodes: string[];
}

export interface ProgressState {
  answered: Record<string, { correct: boolean; at: number }>;
  lastQuiz?: {
    mode: string;
    subjectId?: string;
    chapterId?: string;
    pointId?: string;
    level?: string;
  };
  pointStats: Record<string, { correct: number; wrong: number }>;
}

export type QuizMode = 'chapter' | 'point' | 'level' | 'random' | 'wrong';
