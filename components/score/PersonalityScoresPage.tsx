import React from "react";
import { Flex, Text, Button, Progress } from "@chakra-ui/react";
import { TRAIT_QUESTIONS } from "./Personality_Score";

interface PersonalityScoresProps {
  traitScores: Record<string, number>;
  onComplete: () => void;
}

const PersonalityScoresPage: React.FC<PersonalityScoresProps> = ({ traitScores, onComplete }) => {

  const traitResults = Object.keys(TRAIT_QUESTIONS).map((trait) => {
    const score = traitScores[trait];
    const totalQuestions = TRAIT_QUESTIONS[trait].length;
    const percentage = (score / (totalQuestions * 10)) * 10;

    return { trait, percentage };
  });

  const getColor = (percentage: number) => {
    if (percentage <= 2.7) {
      return { color: "red", label: "Low" };
    } else if (percentage >= 2.7 && percentage <= 3.5) {
      return { color: "yellow", label: "Average" };
    } else {
      return { color: "green", label: "High" };
    }
  };

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" h="100%" w="100%">
      <Text alignItems="center" fontWeight="bold" fontSize="xl" mb={10}>
        Your Personality Scores:
      </Text>
      <Flex direction="column" w="100%" alignItems="center">
        {traitResults.map(({ trait, percentage }) => (
          <Flex key={trait} alignItems="center" mb={4} ml={-30} flexDirection="row" h="10vh" w="100%">
            <Flex alignItems="center" w="100%" mb={4}>
              <Text fontWeight="bold" w={210} ml={-10} mt={2}>
                {trait}
              </Text>
              <Progress
                value={percentage}
                flex={1}
                max={5}
                w="100%"
                h="40px"
                colorScheme={getColor(percentage).color}
              />
              <Text ml={2}>{percentage.toFixed(1)}</Text>
              <Text ml={2} color={getColor(percentage).color} fontWeight="bold">
                {getColor(percentage).label}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Button mt={2} onClick={onComplete}>
        Next
      </Button>
    </Flex>
  );
};

export default PersonalityScoresPage;
