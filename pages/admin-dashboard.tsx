import { useState, useEffect } from "react";
import { Flex, Table, Thead, Tbody, Tr, Th, Td, Button, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [csvFiles, setCsvFiles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCsvFiles() {
      try {
        const response = await fetch("/api/csv-files");
        if (response.ok) {
          const files = await response.json();
          setCsvFiles(files);
        } else {
          throw new Error("Failed to fetch CSV files");
        }
      } catch (error) {
        console.error("Error fetching CSV files:", error);
      }
    }
    fetchCsvFiles();
  }, []);

  function handleLogout() {
    router.push("/");
  }

  return (
    <Flex direction="column" p={5}>
      <Button mb={4} onClick={handleLogout}>
        Logout
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>S.No</Th>
            <Th>CSV Files</Th>
          </Tr>
        </Thead>
        <Tbody>
          {csvFiles.length > 0 ? (
            csvFiles.map((file, index) => (
              <Tr key={file}>
                <Td>{index + 1}</Td>
                <Td>
                  <Link href={`/api/download-csv?filename=${encodeURIComponent(file)}`} download>
                    {file}
                  </Link>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2}>No CSV files available</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Flex>
  );
}