import { questions } from "../data/ability-test";
export interface ATestQuestion {
    id: number;
    text: string;
    options: TestAnswerOption[];
    section: string;
    image?: string;
  }
  
  export interface TestAnswerOption {
    answer: string;
    score?: number;
  }
  
  export function getQuestionAnswerScore(
    questionNumber: number,
    answer: string
  ): number | undefined {
    const question = questions.find(
      (q) => q.id === questionNumber
    );
  
    if (!question) return undefined;
  
    const selectedOption = question.options.find(
      (option) => option.answer === answer
    );
  
    return selectedOption?.score;
  }