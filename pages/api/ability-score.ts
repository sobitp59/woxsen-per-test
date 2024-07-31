import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

// Helper function to process CSV
const processCSV = (filePath: string) => {
  return new Promise((resolve, reject) => {
    const scores = {
      verbal: { total: 4, obtained: 0 },
      numerical: { total: 4, obtained: 0 },
      analytical: { total: 4, obtained: 0 },
      inferential: { total: 18, obtained: 0 }, 
    };

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject('File not found: ' + err);
      }

      parse(data, {
        columns: true,
        trim: true,
        skip_empty_lines: true,
        relax_column_count: true, // Allows varying column counts
      }, (err, rows) => {
        if (err) {
          return reject('Error parsing CSV: ' + err);
        }

        rows.forEach(row => {
          const questionNumber = parseInt(row['S.No']);
          const score = parseInt(row['Score']);

          if (!isNaN(questionNumber) && !isNaN(score)) {
            if (questionNumber >= 1 && questionNumber <= 12) {
              if (questionNumber <= 4) {
                scores.verbal.obtained += score;
              } else if (questionNumber <= 8) {
                scores.numerical.obtained += score;
              } else if (questionNumber <= 12) {
                scores.analytical.obtained += score;
              }
            } else if (questionNumber >= 13 && questionNumber <= 17) {
              scores.inferential.obtained += score;
            }
          }
        });

        resolve(scores);
      });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const filePath = path.join(process.cwd(), 'public', 'csv-files', 'psychometricability_sheet_1.csv');

  try {
    const parsedData = await processCSV(filePath);
    res.status(200).json({ data: parsedData });
  } catch (error) {
    console.error('Error getting ability score:', error);
    res.status(500).json({ message: 'Error getting Ability score' });
  }
}
