import { NextApiRequest, NextApiResponse } from "next";
import { saveToCsv } from "../../lib/csv-utils";
import { CsvData } from "../../lib/types";
import { getQuestionAnswerPersonalityScore } from "../../lib/personality-test";
import test from "node:test";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userTestAnswers }: { userTestAnswers: (string | number)[] } = req.body;

  const testScores: CsvData[] = userTestAnswers.map((answer, index) => {
    let parsedAnswer: string;

    if (typeof answer === 'string') {
      parsedAnswer = answer;
    } else {
      parsedAnswer = answer.toString();
    }

    const score = getQuestionAnswerPersonalityScore(index + 1, parsedAnswer);

    if (score === undefined) {
      throw new Error(`Score undefined for answer at index ${index}`);
    }

    return {
      sNo: index + 1,
      statement: `Question ${index + 1}`, // Adjust as needed
      score: score,
      Time: 'N/A'
    };
  });

  const timestamp = Date.now();
  const filename = `test_result_${timestamp}.csv`;
  const folderPath = "csv-files"; 

  try {
    await saveToCsv(testScores, `${folderPath}/${filename}`);
    res.status(200).json({ success: true, filename });
} catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
