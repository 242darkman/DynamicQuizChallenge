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
        const prompt = `Generate a multiple-choice question about ${theme} at ${level} level. Include one correct answer and three incorrect answers. Format the question as follows:\n- Question: [The question here]\n- Correct answer: [The correct answer here]\n- Incorrect answers: [Three incorrect answers here]`;
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
        const questionMatch = responseText.match(/Question: (.+)/);
        const correctAnswerMatch = responseText.match(/Correct answer: (.+)/);
        const incorrectAnswersMatch = responseText.match(
          /Incorrect answers: (.+), (.+), (.+)/,
        );

        if (questionMatch && correctAnswerMatch && incorrectAnswersMatch) {
          const question = questionMatch[1];
          const correctAnswer = correctAnswerMatch[1];
          const incorrectAnswers = incorrectAnswersMatch.slice(1, 4);

          // Construisez l'objet question ici
          const questionObj = {
            theme,
            question,
            correct_answer: correctAnswer,
            incorrect_answers: incorrectAnswers,
          };

          if (
            !questionsArray.some((q) => q.question === questionObj.question)
          ) {
            questionsArray.push(questionObj);
          }
        }
      }
      return questionsArray;
    } catch (error) {
      throw new Error(`Error generating questions: ${error}`);
    }
    

    return;
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
