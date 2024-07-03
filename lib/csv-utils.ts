// lib/csv-utils.ts
import Papa from "papaparse";
import { saveAs } from "file-saver";

export interface CsvData {
  sNo: number;
  statement: string;
  score: number;
}

export function saveToCsv(data: CsvData[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
