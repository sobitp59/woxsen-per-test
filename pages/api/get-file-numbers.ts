import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Get latest file numbers for each type
    const latestDemographicFileNumber = getLatestFileNumber('demographic_sheet_');
    const latestPersonalityFileNumber = getLatestFileNumber('personality_sheet_');
    const latestPyschometricFileNumber = getLatestFileNumber('psychometricability_sheet_');

    res.status(200).json({
      latestDemographicFileNumber,
      latestPersonalityFileNumber,
      latestPyschometricFileNumber
    });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files' });
  }
}
