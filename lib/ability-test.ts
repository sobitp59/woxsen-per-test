import { questions } from "../data/ability-test";
export interface ATestQuestion {
    no: number;
    text: string;
    options: TestAnswerOption[];
    section: string;
    image?: string;
  }
  
  export interface TestAnswerOption {
    answer: string;
    score?: number;
  }
  
  export function getQuestionAnswerAbilityScore(
    questionNumber: number,
    answer: string
  ): number | undefined {
    const question = questions.find(
      (q) => q.no === questionNumber
    );
  
    if (!question) return undefined;
  
    const selectedOption = question.options.find(
      (option) => option.answer === answer
    );
  
    return selectedOption?.score;
  }