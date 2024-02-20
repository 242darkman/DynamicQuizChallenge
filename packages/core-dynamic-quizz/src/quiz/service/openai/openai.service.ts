import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;

  constructor() {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set.');
    }

    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }

  async generateQuestions(
    theme: string,
    level: string,
    numberOfQuestions: number,
  ): Promise<any[]> {
    try {
      const questionsArray = [];

      while (questionsArray.length < numberOfQuestions) {
        const isMixedTheme = theme === 'mixed';
        const prompt = isMixedTheme
          ? `Generate a multiple-choice question in French for any theme at ${level} level. Include the theme of the question, one correct answer, and three incorrect answers. Format the question as follows:
- Theme: [The specific theme here]
- Question: [The question here]
- Correct answer: [The correct answer here]
- Incorrect answers: [Three incorrect answers here]`
          : `Generate a multiple-choice question about ${theme} at ${level} level in French. Include one correct answer and three incorrect answers. Format the question as follows:
- Question: [The question here]
- Correct answer: [The correct answer here]
- Incorrect answers: [Three incorrect answers here]`;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
          ],
        });

        const responseText = response.choices[0].message.content;
        const themeMatch = isMixedTheme
          ? responseText.match(/Theme: (.+)/)
          : null;
        const themeSpecific = themeMatch ? themeMatch[1] : theme;
        const questionMatch = responseText.match(/Question: (.+)/);
        const correctAnswerMatch = responseText.match(/Correct answer: (.+)/);
        const incorrectAnswersMatch = responseText.match(
          /Incorrect answers: (.+), (.+), (.+)/,
        );

        if (!questionMatch || !correctAnswerMatch || !incorrectAnswersMatch)
          continue;

        const question = questionMatch[1];
        const correctAnswer = correctAnswerMatch[1];
        const incorrectAnswers = incorrectAnswersMatch.slice(1, 4);

        const questionObj = {
          theme: themeSpecific,
          question,
          correct_answer: correctAnswer,
          incorrect_answers: incorrectAnswers,
        };

        if (questionsArray.some((q) => q.question === questionObj.question))
          continue;

        questionsArray.push(questionObj);
      }
      return questionsArray;
    } catch (error) {
      throw new Error(`Error generating questions: ${error}`);
    }
  }

  async generateHint(question: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Generate a hint for the following question: "${question}"`,
          },
        ],
      });

      const hint = response.choices[0].message.content;
      return hint;
    } catch (error) {
      throw new Error(`Error generating hint: ${error}`);
    }
  }
}
