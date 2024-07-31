import { ATestQuestion } from "../lib/ability-test";
import Image from 'next/image';

export const questions: ATestQuestion[] = [
    // Verbal Ability
    { no: 1, text: 'The sentence below has a word in which the letters are jumbled up. Rearrange the letters in capitals and write the correct version below it.\nThe balloon SHDIES as the air escapes from it.',
      options: [
        { answer: 'DISHES', score: 0 },
        { answer: 'HISSED', score: 1 },
        { answer: 'HIDESS', score: 0 },
        { answer: 'SHIEDS', score: 0 }
      ], section: 'Verbal'
    },
    { no: 2, 
        text: `Order the following sentences to form a meaningful paragraph : 
        \nS1: The restaurant was known for its delicious seafood dishes. 
        \nP: The chef was passionate about using fresh, local ingredients in all of his dishes. 
      \nQ: The menu featured a variety of fish, shrimp, and lobster dishes. 
      \nR: The waitstaff were friendly and knowledgeable about the menu. 
      \nS: The restaurant was decorated with nautical-themed artwork and accents. 
      \nS6: Diners could enjoy their meals while looking out at the ocean view from the restaurant’s windows.`, 
      options: [{ answer: 'PRQS', score: 1 }, 
        { answer: 'PQRS', score: 0 }, 
        { answer: 'SQPR', score: 0 }, 
        { answer: 'PRSQ', score: 0 }], 
        section: 'Verbal'
    },
    { no: 3, text: 'Select the word that is most similar in meaning to "abundant."', options: [{ answer: 'Sparse', score: 0 }, { answer: 'Plentiful', score: 1 }, { answer: 'Limited', score: 0 }, { answer: 'Scarce', score: 0 }], section: 'Verbal' },
    { no: 4, text: 'CUP : LIP :: BIRD : ?', options: [{ answer: 'BUSH', score: 0 }, { answer: 'GRASS', score: 0 }, { answer: 'FOREST', score: 0 }, { answer: 'BEAK', score: 1 }], section: 'Verbal' },
  
    // Numerical Ability
    { no: 5, text: 'From the below table Answer the Question below :', options: [{ answer: '$352.30', score: 1 }, { answer: '$452.90', score: 0 }, { answer: '$247.05', score: 0 }, { answer: '$345.40', score: 0 }], section: 'Numerical' },
    { no: 6, text: 'A train travels from one station to another at a speed of 40 km/hour and returns to the first station at the speed of 60 km/hour. Calculate the average speed and average velocity of the train.', options: [{ answer: '50 kmph', score: 0 }, { answer: '48 kmph', score: 1 }, { answer: '60 kmph', score: 0 }, { answer: '52 kmph', score: 0 }], section: 'Numerical' },
    { no: 7, text: 'If a box contains 48 red balls and 72 blue balls, what is the ratio of red balls to blue balls?', options: [{ answer: '1:2', score: 0 }, { answer: '2:1', score: 0 }, { answer: '3:2', score: 0 }, { answer: '2:3', score: 1 }], section: 'Numerical' },
    { no: 8, text: 'The population of a town is 50,000. If it increases by 10% annually, what will be the population after 3 years?', options: [{ answer: '55,000', score: 0 }, { answer: '57,500', score: 0 }, { answer: '60,000', score: 0 }, { answer: 'None of the Above', score: 1 }], section: 'Numerical' },
  
    // Analytical Ability
    { no: 9, text: 'Which of the Boxes comes next in the Sequence?', options: [{ answer: 'A', score: 0 }, { answer: 'B', score: 1 }, { answer: 'C', score: 0 }, { answer: 'D', score: 0 }, { answer: 'E', score: 0 }], section: 'Analytical', image: '/images/mbti/QuesImg.png' },
    {no: 10, text: 'In a certain code, HARYANA is written as 8197151, how is DELHI written in that code?', options: [{ answer: '45389', score: 1 }, { answer: '98354', score: 0 }, { answer: '54398', score: 0 }, { answer: 'None of the Above', score: 0 }],
      section: 'Analytical'},
    { no: 11, text: '3, 10, 101, ?', options: [{ answer: '10101', score: 0 }, { answer: '10201', score: 0 }, { answer: '10202', score: 1 }, { answer: '11012', score: 0 }], section: 'Analytical' },
    { no: 12, text: 'Statements : Some actors are singers. All the singers are dancers.\nConclusions : \n1. Some actors are dancers. \n2. No singer is actor.', options: [{ answer: 'Only (1) conclusion follows', score: 1 }, { answer: 'Only (2) conclusion follows', score: 0 }, { answer: 'Either (1) or (2) follows', score: 0 }, { answer: 'Neither (1) nor (2) follows', score: 0 }, { answer: 'Both (1) and (2) follow', score: 0 }], section: 'Analytical' },
  
  ];