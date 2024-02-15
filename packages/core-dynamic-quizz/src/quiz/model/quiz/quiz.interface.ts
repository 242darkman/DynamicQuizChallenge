export interface QuizInterface {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  randomizeSubjects: boolean;
  isPrivate: boolean;
  score?: number;
  numberOfQuestions: number;
  numberOfRounds?: number;
}
