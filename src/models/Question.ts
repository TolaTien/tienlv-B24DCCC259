// src/models/types.ts
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';

export const DifficultyLabels: Record<Difficulty, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
  VERY_HARD: 'Rất khó',
};

export interface KnowledgeBlock {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

export interface Question {
  id: string;
  subjectId: string;
  knowledgeBlockId: string;
  content: string;
  difficulty: Difficulty;
}

export interface ExamStructureRule {
  knowledgeBlockId: string;
  difficulty: Difficulty;
  quantity: number;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  structure: ExamStructureRule[];
  questions: Question[];
  createdAt: string;
}