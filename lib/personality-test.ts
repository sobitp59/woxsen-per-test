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

export interface TestResult {
  timestamp: number;
  testAnswers: { questionNumber: number; score: number }[];
}

const DB_NAME = "MBTI_PERSONALITY_TEST_APP_IDB";
const DB_VERSION = 1;
const TEST_RESULT_STORE = "TEST_RESULT_STORE";

async function getDb() {
  const db = await openDB<{
    [TEST_RESULT_STORE]: {
      key: number;
      value: TestResult;
    };
  }>(DB_NAME, DB_VERSION, {
    upgrade(idb) {
      idb.createObjectStore(TEST_RESULT_STORE, {
        keyPath: "timestamp",
      });
    },
  });

  return db;
}

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

export function getSavedTestResult(id: number) {
  return Future.make<Result<Option<TestResult>, Error>>((resolve) => {
    getDb()
      .then((db) => db.get(TEST_RESULT_STORE, id))
      .then(Option.fromNullable)
      .then((testResult) => resolve(Result.Ok(testResult)))
      .catch((error) => resolve(Result.Error(error)));
  });
}

export function getAllSavedTestResult() {
  return Future.make<Result<Option<TestResult[]>, Error>>((resolve) => {
    getDb()
      .then((db) => db.getAll(TEST_RESULT_STORE))
      .then(Option.fromNullable)
      .then((testResult) => resolve(Result.Ok(testResult)))
      .catch((error) => resolve(Result.Error(error)));
  });
}

export function saveTestResult(testResult: TestResult) {
  return Future.make<Result<number, Error>>((resolve) => {
    getDb()
      .then((db) => db.put(TEST_RESULT_STORE, testResult))
      .then((id) => resolve(Result.Ok(id)))
      .catch((error) => resolve(Result.Error(error)));
  });
}
