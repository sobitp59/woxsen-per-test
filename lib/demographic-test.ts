import { DemographicQuestions } from "../data/demographic-test";
export interface IATestQuestion {
    no: number;
    text: string;
    options: TestAnswerOption[];
  }
  
  export interface TestAnswerOption {
    answer: string;
    score?: number;
  }
  
  export function getQuestionAnswer(
    questionNumber: number,
    answer: string | {answer : string, specification : string} | {mother : string, father : string}
  ): string | {answer : string, specification : string} | {mother : string, father : string} | undefined {


    const question = DemographicQuestions.find(
      (q) => q.no === questionNumber
    );
  
    if (!question) return undefined;
  
    // const selectedOption = question.options.find(
    //   (option) => option.answer === answer
    // );

    const selectedAnswer = question



    return 'selectedOption';
  }