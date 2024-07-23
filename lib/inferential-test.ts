import { inferentialAbilityQuestions } from "../data/Inferential-test";
export interface IATestQuestion {
    id: number;
    text: string;
    options: TestAnswerOption[];
  }
  
  export interface TestAnswerOption {
    answer: string;
    score?: number;
  }
  
  export function getQuestionAnswerScore(
    questionNumber: number,
    answer: string
  ): number | undefined {
    const question = inferentialAbilityQuestions.find(
      (q) => q.id === questionNumber
    );
  
    if (!question) return undefined;
  
    const selectedOption = question.options.find(
      (option) => option.answer === answer
    );
  
    return selectedOption?.score;
  }