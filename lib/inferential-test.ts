import { inferentialAbilityQuestions } from "../data/Inferential-test";
export interface IATestQuestion {
    no: number;
    text: string;
    options: TestAnswerOption[];
  }
  
  export interface TestAnswerOption {
    answer: string;
    score?: number;
  }
  
  export function getQuestionAnswerInferentialScore(
    questionNumber: number,
    answer: string
  ): number | undefined {

    const question = inferentialAbilityQuestions.find(
      (q) => q.no === questionNumber
    );
  
    if (!question) return undefined;
  
    const selectedOption = question.options.find(
      (option) => option.answer === answer
    );

    return selectedOption?.score;
  }