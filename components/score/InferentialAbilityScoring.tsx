import { Flex, Text, Button, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { inferentialAbilityQuestions } from "../../data/Inferential-test"; 
// import { getQuestionAnswerScore } from "../../lib/inferential-test";
interface InferentialAbilityScoringProps {
  answers: Record<number, { answer: string; score?: number }>;
  // answers: Record<number, string>;
}

const InferentialAbilityScoring: React.FC<InferentialAbilityScoringProps> = ({ answers }) => {
  const [totalScore] = useState(18); // Total score is fixed at 18 for this test
  const [obtainedScore, setObtainedScore] = useState<number | null>(null);

  // Calculate obtained score based on user answers
  useEffect(() => {
    let obtained = 0;
    inferentialAbilityQuestions.forEach(IATestQuestion => {
      const userAnswer = answers[IATestQuestion.no];
      if (userAnswer && userAnswer.score) {
        obtained += userAnswer.score;
      }
    });
    setObtainedScore(obtained);
  }, [answers]);
  
  return (
    <Flex
      py={4}
      w="full"
      h="full"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Table variant="simple" size="md">
        {/* <Thead>
          <Tr>
            <Th>Section</Th>
            <Th>Total Score</Th>
            <Th>Obtained Score</Th>
          </Tr>
        </Thead> */}
        <Tbody>
          <Tr>
            <Td w={'50'}>Inferential</Td>
            <Td>{totalScore}</Td>
            <Td>{obtainedScore !== null ? obtainedScore : "Calculating..."}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Button
        mt={8}
        colorScheme="primary"
        variant="outline"
        // onClick={onComplete}
      >
        Complete
      </Button>
    </Flex>
  );
};

export default InferentialAbilityScoring;