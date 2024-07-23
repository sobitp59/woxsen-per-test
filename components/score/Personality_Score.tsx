import { TestQuestion } from '../../lib/personality-test';

type TraitQuestions = {
  [key: string]: number[];
};

export const TRAIT_QUESTIONS: TraitQuestions = {
  'Honesty-Humility': [6, 30, 54, 12, 36, 60, 18, 42, 24, 48],
  'Emotionality': [5, 29, 53, 11, 35, 17, 41, 23, 47, 59],
  'Extraversion': [4, 28, 52, 10, 34, 58, 16, 40, 22, 46],
  'Agreeableness': [3, 27, 9, 33, 51, 15, 39, 57, 2, 45],
  'Conscientiousness': [2, 26, 8, 32, 14, 38, 50, 20, 44, 56],
  'Openness to Experience': [1, 25, 7, 31, 13, 37, 49, 19, 43, 55],
};

export function calculateTraitScores(
  personalityTest: TestQuestion[],
  answers: Record<number, string>
): Record<string, number> {
  const traitScores: Record<string, number> = {
    'Honesty-Humility': 0,
    'Emotionality': 0,
    'Extraversion': 0,
    'Agreeableness': 0,
    'Conscientiousness': 0,
    'Openness to Experience': 0,
  };

  personalityTest.forEach((question) => {
    const answer = answers[question.no];
    const selectedOption = question.answerOptions.find(option => option.answer === answer);
    if (selectedOption && selectedOption.score !== undefined) {
      Object.entries(TRAIT_QUESTIONS).forEach(([trait, questionNumbers]) => {
        if (questionNumbers.includes(question.no)) {
          traitScores[trait] += selectedOption.score!;
        }
      });
    }
  });

  return traitScores;
}
