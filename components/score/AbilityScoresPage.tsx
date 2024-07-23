import React from 'react';
import { Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { questions } from '../../data/ability-test';
import InferentialAbilityScoring from './InferentialAbilityScoring';

interface AbilityScoresPageProps {
  answers: Record<number, string>;
}

const AbilityScoresPage: React.FC<AbilityScoresPageProps> = ({ answers}) => {
  const sectionScores = questions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = { total: 0, obtained: 0 };
    }

    acc[question.section].total += 1; 
    const userAnswer = answers[question.id];
    const correctOption = question.options.find(option => option.score === 1);
    if (userAnswer === correctOption?.answer) {
      acc[question.section].obtained += 1;
    }

    return acc;
  }, {} as Record<string, { total: number, obtained: number }>);

  return (
    <Flex
      py={4}
      w="full"
      h="full"
      direction="column"
      alignItems="center"
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Psychometric Ability Test Results
      </Text>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Section</Th>
            <Th>Total Score</Th>
            <Th>Obtained Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(sectionScores).map(([section, { total, obtained }]) => (
            <Tr key={section}>
              <Td>{section}</Td>
              <Td>{total}</Td>
              <Td>{obtained}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* <Button mt={4} onClick={onComplete}>
        Go to Next Phase
      </Button> */}
      <InferentialAbilityScoring answers={[]}/>
    </Flex>
  );
};

export default AbilityScoresPage;