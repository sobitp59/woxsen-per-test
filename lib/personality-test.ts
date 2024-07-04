import { openDB } from "idb";
import { Option, Future, Result } from "@swan-io/boxed";
import { personalityTest } from "../data/personality-test";

export interface TestQuestion {
  no: number;
  question: string;
  answerOptions: TestAnswerOption[];
}

export interface TestAnswerOption {
  answer: string;
  score: number;
}



const DB_NAME = "MBTI_PERSONALITY_TEST_APP_IDB";
const DB_VERSION = 1;
const TEST_RESULT_STORE = "TEST_RESULT_STORE";



export function getQuestionAnswerScore(
  questionNumber: number,
  answer: string
): number | undefined {
  const question = personalityTest.find(
    (question) => question.no === questionNumber
  );

  return question?.answerOptions.find((option) => option.answer === answer)
    ?.score;
}




