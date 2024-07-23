// lib/csv-utils.ts

import { CsvData } from "./types";

export async function saveToCsv(data: CsvData[], filename: string): Promise<void> {

  const csvContent = [
    "S.No.,Statement,Score",
    ...data.map((row) => `${row.sNo},${row.statement},${row.score}`),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  
  
  if (navigator && (navigator as any).msSaveBlob) {
    // For Internet Explorer and older Edge versions
    (navigator as any).msSaveBlob(blob, filename);
  } else {
    // For other browsers
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.target = "_blank"
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
}
