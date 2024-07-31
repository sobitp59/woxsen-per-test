import { useState, useEffect } from "react";
import { Flex, Table, Thead, Tbody, Tr, Th, Td, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const router = useRouter();
  const [csvFiles, setCsvFiles] = useState<string[]>([]);
  const [excelFileUrl, setExcelFileUrl] = useState<string | null>(null);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCsvFiles() {
      try {
        const response = await fetch("/api/csv-files");
        if (response.ok) {
          const files = await response.json();
          setCsvFiles(files);
          await createExcelFile(files);
        } else {
          throw new Error("Failed to fetch CSV files");
        }
      } catch (error) {
        console.error("Error fetching CSV files:", error);
      }
    }
    fetchCsvFiles();
  }, []);

  async function createExcelFile(files: string[]) {
    try {
      const workbook = XLSX.utils.book_new();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await fetch(`/api/download-csv?filename=${encodeURIComponent(file)}`);
        if (response.ok) {
          const csvData = await response.text();
          const workbookData = XLSX.read(csvData, { type: "string", header: 1 });
          const worksheet = workbookData.Sheets[workbookData.SheetNames[0]];
          XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet ${i + 1}`);
        } else {
          console.error(`Failed to fetch CSV file: ${file}`);
        }
      }
      const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      setExcelFileUrl(url);
      setExcelFileName("Scores.xlsx"); // Set the desired file name for download
    } catch (error) {
      console.error("Error creating Excel file:", error);
    }
  }

  function handleLogout() {
    router.push("/");
  }

  return (
    <Flex direction="column" p={5}>
      <Button mb={4} onClick={handleLogout}>
        Logout
      </Button>
      {/* <Table variant="simple" mb={4}>
        <Thead>
          <Tr>
            <Th>CSV Files</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {csvFiles.length > 0 ? (
            csvFiles.map((file, index) => (
              <Tr key={file}>
                <Td>{file}</Td>
                <Td>
                  <Button
                    as="a"
                    href={`/api/download-csv?filename=${encodeURIComponent(file)}`}
                    download={file}
                  >
                    Download {file}
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2}>No CSV files available</Td>
            </Tr>
          )}
        </Tbody>
      </Table> */}
      {excelFileUrl && (
        <Flex direction="column" align="center" mt={4}>
          <Text mb={2}>Excel File: {excelFileName}</Text>
          <Button as="a" href={excelFileUrl} download={excelFileName}>
            Test Scores
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
