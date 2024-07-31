import React, { useEffect, useState } from 'react';
import { Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { questions } from '../../data/ability-test';
import InferentialAbilityScoring from './InferentialAbilityScoring';
import Link from 'next/link';
import { useRouter } from 'next/router';
interface AbilityScoresPageProps {
  answers: Record<number, string>;
}

const AbilityScoresPage: React.FC<AbilityScoresPageProps> = ({ answers}) => {
  const [sectionScores, setSectionScores] = useState({})
  const router = useRouter();
  // const sectionScores = questions.reduce((acc, question) => {
  //   if (!acc[question.section]) {
  //     acc[question.section] = { total: 0, obtained: 0 };
  //   }

  //   acc[question.section].total += 1; 
  //   const userAnswer = answers[question.no];
  //   const correctOption = question.options.find(option => option.score === 1);
  //   if (userAnswer === correctOption?.answer) {
  //     acc[question.section].obtained += 1;
  //   }

  //   return acc;
  // }, {} as Record<string, { total: number, obtained: number }>);

  async function getAbilityScore(){
    try {
      const response = await fetch("/api/ability-score", {
        method : "GET"
      });
      if (response.ok) {
        const json = await response.json();
        console.log('Reading csv data : ', json.data)
        setSectionScores(json.data)
      } else {
        throw new Error("Failed to fetch CSV files");
      }
    } catch (error) {
      console.log('Error getting ability score')
    }
  }

  useEffect(() => {
    getAbilityScore()
  }, [])

  console.log('SECTION SCORES ', sectionScores) 

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
          {sectionScores && Object.entries(sectionScores).map(([section, { total, obtained }]) => (
            <Tr key={section}>
              <Td>{section}</Td>
              <Td>{total}</Td>
              <Td>{obtained}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button
        mt={8}
        colorScheme="blue" 
        variant="solid" 
        onClick={() => router.push("/")} 
      >
        Complete
      </Button>
  
      {/* <InferentialAbilityScoring answers={[]}/> */}
    </Flex>
  );
};

export default AbilityScoresPage;