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

        rows.forEach((row: { [x: string]: string; }) => {
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

  try {
    // Path to the directory where the files are stored
    const directoryPath = path.resolve('./public/csv-files');
    const files = fs.readdirSync(directoryPath);

    // Function to get the latest file number based on the prefix
    const getLatestFileNumber = (prefix: string): number => {
      const fileNumbers = files
        .filter(file => file.startsWith(prefix) && file.endsWith('.csv'))
        .map(file => {
          const match = file.match(new RegExp(`${prefix}(\\d+)\\.csv`));
          return match ? parseInt(match[1], 10) : 0;
        });

      return fileNumbers.length > 0 ? Math.max(...fileNumbers) : 0;
    };

    const latestFileNumber = getLatestFileNumber('psychometricability_sheet_');
    if (latestFileNumber === 0) {
      return res.status(404).json({ message: 'No psychometricability_sheet files found' });
    }

    const latestFilePath = path.join(directoryPath, `psychometricability_sheet_${latestFileNumber}.csv`);
    const parsedData = await processCSV(latestFilePath);
    res.status(200).json({ data: parsedData });

  } catch (error) {
    console.error('Error getting ability score:', error);
    res.status(500).json({ message: 'Error getting Ability score' });
  }
}
