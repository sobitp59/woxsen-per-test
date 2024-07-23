import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getQuestionAnswerScore } from '../../lib/personality-test';
import { CsvData } from '../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { testScores, filename } = req.body;

  if (!testScores || !filename) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  // TEST
  const testScoresData: CsvData[] = testScores.map((answer : any, index : number ) => {
    let parsedAnswer: string;

    if (typeof answer === 'string') {
      parsedAnswer = answer;
    } else {
      parsedAnswer = answer.toString();
    }

    const score = getQuestionAnswerScore(index + 1, parsedAnswer);

    if (score === undefined) {
      throw new Error(`Score undefined for answer at index ${index}`);
    }

    console.log('SCORE ', score)

    return {
      sNo: index + 1,
      statement: `Question ${index + 1}`, // Adjust as needed
      score: score,
    };
  });

  const csvContent = generateCsvContent(testScoresData);
  const filePath = path.join(process.cwd(), 'public', 'csv-files', filename);

  try {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, csvContent);
    res.status(200).json({ message: 'CSV file saved successfully', filename });
  } catch (error) {
    console.error('Error saving CSV file:', error);
    res.status(500).json({ message: 'Error saving CSV file' });
  }
}

function generateCsvContent(testScores: any[]): string {
  const header = 'S.No,Statement,Score\n';
  const rows = testScores.map(score => 
    `${score.sNo},"${score.statement.replace(/"/g, '""')}",${score.score}`
  ).join('\n');
  return header + rows;
}

// generate csv for demo : serial number, question , answer