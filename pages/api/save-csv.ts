import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getQuestionAnswerPersonalityScore  } from '../../lib/personality-test';
import {  getQuestionAnswerAbilityScore } from '../../lib/ability-test';
import {  getQuestionAnswerInferentialScore } from '../../lib/inferential-test'; 
import { CsvData } from '../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('api called')
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { testScores, filename, moduleType, timeRecords  } = req.body;

  console.log('TESTSCORES', testScores)

  if (!testScores || !filename) {
    return res.status(400).json({ message: 'Missing required data' });
  }
  const demographicData = moduleType === 'Demographic' && testScores
  console.log('DEMO DATA ', demographicData)

  // TEST
  const testScoresData: CsvData[] = moduleType !== 'Demographic' && testScores.map((answer : any, index : number ) => {
    let parsedAnswer: string;

    if (typeof answer === 'string') {
      parsedAnswer = answer;
    } else {
      parsedAnswer = answer.toString();
    }

    console.log('QNO ', index+1)
    console.log('PANSWER ', parsedAnswer)

    const personalityScore = getQuestionAnswerPersonalityScore(index + 1, parsedAnswer);
    const abilityScore = getQuestionAnswerAbilityScore(index + 1, parsedAnswer);
    const inferentialScore = getQuestionAnswerInferentialScore(index + 1, parsedAnswer);

    const score = moduleType === 'Personality' ? personalityScore :
    moduleType === 'Ability' ? abilityScore :
    moduleType === 'Inferential' ? inferentialScore :
    null;

    
    if (score === null) {
      throw new Error(`Score undefined for answer at index ${index}`);
    }

    console.log('API SCORE ', score)

    return {
      sNo: index + 1,
      statement: `Question ${index + 1}`, // Adjust as needed
      score: score,
      Time: timeRecords[`Question ${index + 1}`] || 'N/A'
    };
  });


  let demoAnswerData = moduleType === 'Demographic' && Object.keys(testScores).map((questionNumber, index) => {

    // TODO : look for question number 7,8,15 without specification
    // const demoAnswer = ((Number(questionNumber) === 7 && testScores.answer === 'State Board') || (Number(questionNumber) === 8 && testScores.answer === 'State Board') || (Number(questionNumber) === 15 && testScores.answer === 'Yes') ) ? testScores[questionNumber]?.answer : Number(questionNumber) === 13 ? `Mother - ${testScores[questionNumber].mother} Father : ${testScores[questionNumber].father}`:  testScores[questionNumber]
    const demoAnswer = (Number(questionNumber) === 7 || Number(questionNumber) === 8 || Number(questionNumber) === 15 ) ? testScores[questionNumber]?.answer : Number(questionNumber) === 13 ? `Mother - ${testScores[questionNumber].mother} Father : ${testScores[questionNumber].father}`:  testScores[questionNumber]
    const demoSpecification = (Number(questionNumber) === 7 || Number(questionNumber) === 8 || Number(questionNumber) === 15 ) ? testScores[questionNumber]?.specification : 'N/A'

    const time = timeRecords[`Question ${Number(questionNumber)}`] || 'N/A';
    
    return {
      sNo : index +1,
      question : `Question ${index + 1}`,
      answer : demoAnswer,
      specification : demoSpecification,
      time 
    }
  })


  let csvContent = moduleType === 'Demographic' ? generateCsvContentForDemographic(demoAnswerData) :generateCsvContent(testScoresData, moduleType, timeRecords);

  console.log('CSV CONTENT ', csvContent)
  let lastFileNumber = 0;
  lastFileNumber++;
  const filename1 = `psychometricability_sheet_${lastFileNumber}.csv`;
  // const filepathMerge = path.join(process.cwd(), 'public', 'csv-files', filename1);
  const filePath = path.join(process.cwd(), 'public', 'csv-files', filename);

  const readFilePathPsy: string = moduleType === 'Inferential' ? path.join(process.cwd(), 'public', 'csv-files', filename1) : '';
  const filepathMerge = path.join(process.cwd(), 'public', 'csv-files', filename1);

  try {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    if (moduleType === 'Inferential') {
      csvContent = '\n' + csvContent; 
      await fs.promises.appendFile(filepathMerge, csvContent);
    } else {
      await fs.promises.writeFile(filePath, csvContent);
    }

    res.status(200).json({ message: 'CSV file saved successfully', filename });
  } catch (error) {
    console.error('Error saving CSV file:', error);
    res.status(500).json({ message: 'Error saving CSV file' });
  }
}

function generateCsvContent(testScores: any[], moduleType : string, timeRecords: Record<string, string> ): string {
  const header = 'S.No,Statement,Score,Time\n';
  const time = timeRecords;
  const rows = testScores.map(score => 
    `${moduleType === 'Inferential' ? score.sNo + 12 : score.sNo},"${score.statement.replace(/"/g, '""')}",${score.score},${time}`
  ).join('\n');
  return moduleType === 'Inferential' ?  rows : header + rows ;
}

// function generateCsvContentForDemographic(demoAnswerData) : string{
//   const header = 'S.No,Question,Answer,Specification\n';

//   console.log('DEMO CSV CONTENT ', demoAnswerData)
//   const rows = demoAnswerData.map(({sNo,question, answer, specification }) => {
//     return `${sNo},"${question?.replace(/"/g, '""')}","${answer?.replace(/"/g, '""')}",${specification}`
//   }).join('\n');

//   return header + rows;
// }

// function generateCsvContentForDemographic(demoAnswerData: any[], timeRecords: Record<string, string>): string {
//   const header = 'S.No,Question,Answer,Specification,Time\n';

//   const rows = demoAnswerData.map(({ sNo, question, answer, specification }) => {
//     const answerText = typeof answer === 'object' ? answer.answer : answer;
//     const specText = typeof answer === 'object' ? answer.specification : specification;
//     const time = timeRecords[`Question ${sNo}`] || 'N/A';
//     return `${sNo},"${question?.replace(/"/g, '""')}","${answerText?.replace(/"/g, '""')}",${specText || 'N/A'},${time}`
//   }).join('\n');

//   return header + rows;
// }
// generate csv for demo : serial number, question , answer


function generateCsvContentForDemographic(demoAnswerData: any[] ): string {
  const header = 'S.No,Question,Answer,Specification,Time\n';

  const rows = demoAnswerData.map(({ sNo, question, answer, specification, time }) => {
    const answerText = typeof answer === 'object' ? answer.answer : answer;
    const specText = typeof answer === 'object' ? answer.specification : specification;
    return `${sNo},"${question?.replace(/"/g, '""')}","${answerText?.replace(/"/g, '""')}",${specText || 'N/A'},${time || 'N/A'}`; // Ensure 'N/A' is used for undefined time
  }).join('\n');

  return header + rows;
}
