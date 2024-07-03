import { TestQuestion } from "../lib/personality-test";

export const personalityTest: TestQuestion[] = [
  {
    no: 1,
    question: "At a party do you: ",
    answerOptions: [
      {
        answer: "Strongly Disagree",
        score: 1,
      },
      { answer: "Disagree", score: 2 },
      { answer: "Neutral", score: 3 },
      { answer: "Agree", score: 4 },
      { answer: "Strongly Agree", score: 5 },
    ],
  },
  {
    no: 2,
    question: "Are you more: ",
    answerOptions: [
      { answer: "Strongly Disagree", score: 1 },
      { answer: "Disagree", score: 2 },
      { answer: "Neutral", score: 3 },
      { answer: "Agree", score: 4 },
      { answer: "Strongly Agree", score: 5 },
    ],
  },
  {
    no: 3,
    question: "Is it worse to: ",
    answerOptions: [
      { answer: "Strongly Disagree", score: 1 },
      { answer: "Disagree", score: 2 },
      { answer: "Neutral", score: 3 },
      { answer: "Agree", score: 4 },
      { answer: "Strongly Agree", score: 5 },
    ],
  },
  // Repeat for other questions
  {
    no: 4,
    question: "Do you tend to be more: ",
    answerOptions: [
      { answer: "Strongly Disagree", score: 1 },
      { answer: "Disagree", score: 2 },
      { answer: "Neutral", score: 3 },
      { answer: "Agree", score: 4 },
      { answer: "Strongly Agree", score: 5 },
    ],
  },
];
