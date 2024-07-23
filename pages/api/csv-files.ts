import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const csvDir = path.join(process.cwd(), 'public', 'csv-files');
  
  fs.readdir(csvDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading CSV directory' });
    }
    
    const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
    res.status(200).json(csvFiles);
  });
}