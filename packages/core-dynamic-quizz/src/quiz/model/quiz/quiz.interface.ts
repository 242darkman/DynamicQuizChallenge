import { SubjectInterface } from 'src/quiz/model/subject/subject.interface';

export interface QuizInterface {
  id: number;
  name: string;
  subjects: SubjectInterface[];
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  randomizeSubjects: boolean;
  isPrivate: boolean;
  score?: number;
  numberOfQuestions: number;
  numberOfRounds?: number;
}
