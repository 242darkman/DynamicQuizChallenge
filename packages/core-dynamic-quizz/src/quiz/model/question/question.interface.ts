import { QuizInterface } from 'src/quiz/model/quiz/quiz.interface';

export interface QuestionInterface {
  id: number;
  content: string;
  answer: string;
  hint?: string;
  explanation?: string;
  quiz: QuizInterface;
}
