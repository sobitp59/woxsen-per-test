import { personalityTest } from "../data/personality-test";

export interface TestQuestion {
  no: number;

  question: string;
  answerOptions: TestAnswerOption[];
}

export interface TestAnswerOption {
  answer: string;
  score?: number;
}

export function getQuestionAnswerScore(
  questionNumber: number,
  answer: string
): number | undefined {
  const question = personalityTest.find(
    (q) => q.no === questionNumber
  );

  if (!question) return 0;

  const selectedOption = question.answerOptions.find(
    (option) => option.answer === answer
  );

  return selectedOption?.score;
}