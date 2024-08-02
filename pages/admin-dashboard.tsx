import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const router = useRouter();
  const [csvFiles, setCsvFiles] = useState<string[]>([]);
  const [excelFileUrls, setExcelFileUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const [excelFileNames, setExcelFileNames] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCsvFiles() {
      try {
        const response = await fetch(
          "https://woxsen-per-test.vercel.app/api/csv-files"
        );
        if (response.ok) {
          const files = await response.json();
          setCsvFiles(files);
          await createExcelFiles(files);
        } else {
          throw new Error("Failed to fetch CSV files");
        }
      } catch (error) {
        console.error("Error fetching CSV files:", error);
      }
    }
    fetchCsvFiles();
  }, []);

  async function createExcelFiles(files: string[]) {
    const groupedFiles: { [key: string]: { [key: string]: string[] } } = {};

    // Group files by increment number
    files.forEach((file) => {
      const match = file.match(/_(\d+)\.csv$/);
      if (match) {
        const incrementNumber = match[1];
        if (!groupedFiles[incrementNumber]) {
          groupedFiles[incrementNumber] = {
            demographic: [],
            personality: [],
            psychometric: [],
          };
        }
        if (file.includes("demographic"))
          groupedFiles[incrementNumber].demographic.push(file);
        else if (file.includes("personality"))
          groupedFiles[incrementNumber].personality.push(file);
        else if (file.includes("psychometric"))
          groupedFiles[incrementNumber].psychometric.push(file);
      }
    });

    const excelFiles = await Promise.all(
      Object.keys(groupedFiles).map(async (incrementNumber) => {
        const filesToProcess = groupedFiles[incrementNumber];
        if (
          filesToProcess.demographic.length > 0 ||
          filesToProcess.personality.length > 0 ||
          filesToProcess.psychometric.length > 0
        ) {
          try {
            const workbook = XLSX.utils.book_new();
            const sheetNames = ["demographic", "personality", "psychometric"];

            // Append sheets to workbook
            for (const category of sheetNames) {
              const filesForCategory = filesToProcess[category];
              for (let i = 0; i < filesForCategory.length; i++) {
                const file = filesForCategory[i];
                try {
                  const csvData = await fetch(
                    `https://woxsen-per-test.vercel.app/api/download-csv?filename=${encodeURIComponent(file)}`
                  ).then((response) => response.text());
                  const workbookData = XLSX.read(csvData, { type: "string" });
                  const worksheet =
                    workbookData.Sheets[workbookData.SheetNames[0]];
                  XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    `${category} Sheet ${i + 1}`
                  );
                } catch (error) {
                  console.error(`Failed to fetch CSV file: ${file}`, error);
                }
              }
            }

            // Write workbook to a blob
            const excelData = XLSX.write(workbook, {
              bookType: "xlsx",
              type: "array",
            });
            const blob = new Blob([excelData], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);

            return {
              incrementNumber,
              url,
              name: `Scores_${incrementNumber}.xlsx`,
            };
          } catch (error) {
            console.error(
              `Error creating Excel file for increment ${incrementNumber}:`,
              error
            );
            return null;
          }
        }
        return null;
      })
    );

    // Filter out null results and update state
    const validFiles = excelFiles.filter((file) => file !== null) as {
      incrementNumber: string;
      url: string;
      name: string;
    }[];
    setExcelFileUrls(
      validFiles.reduce(
        (acc, file) => ({ ...acc, [file.incrementNumber]: file.url }),
        {}
      )
    );
    setExcelFileNames(
      validFiles.reduce(
        (acc, file) => ({ ...acc, [file.incrementNumber]: file.name }),
        {}
      )
    );
    setLoading(false);
  }

  function handleLogout() {
    router.push("/");
  }

  // Define color mode-based styles
  const tableBg = useColorModeValue("white", "gray.800");
  const tableBorderColor = useColorModeValue("gray.200", "gray.600");
  const customColor = "var(--chakra-colors-red-500)";
  const buttonColor = isClicked ? "red.500" : "gray.200";

  return (
    <Flex
      direction="column"
      p={5}
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="100vh"
    >
      <Button
        mb={4}
        bg="red.500"
        color="white"
        onClick={handleLogout}
      >
        Logout
      </Button>
      {loading ? (
        <Text
          fontSize="xl"
          textAlign="center"
          mt={10}
        >
          Loading...
        </Text>
      ) : (
        Object.keys(excelFileUrls).map((incrementNumber) => (
          <Flex
            key={incrementNumber}
            direction="column"
            align="center"
            mt={6}
            bg={tableBg}
            p={5}
            borderRadius="md"
            shadow="md"
            border={`1px solid ${tableBorderColor}`}
          >
            <Table
              variant="simple"
              size="md"
            >
              <Thead>
                <Tr>
                  <Th
                    color={customColor}
                    fontSize="lg"
                  >
                    Test Scores
                  </Th>
                  <Th
                    color={customColor}
                    fontSize="lg"
                  >
                    Download Excel Files
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                    >
                      Test Scores {incrementNumber}
                    </Text>
                  </Td>
                  <Td>
                    <Button
                      as="a"
                      href={excelFileUrls[incrementNumber]}
                      download={excelFileNames[incrementNumber]}
                      colorScheme="red"
                      variant="solid"
                    >
                      Download Excel - Test Scores {incrementNumber}
                    </Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Flex>
        ))
      )}
    </Flex>
  );
}
