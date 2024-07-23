import { useState } from 'react';
import { useRouter} from 'next/router';
import {
  Flex,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Button,
} from "@chakra-ui/react";

interface AbilityTestInstructionsProps {
  onCloseAbTestInstructions: () => void;
}

export default function AbilityTestInstructions({ onCloseAbTestInstructions }: AbilityTestInstructionsProps) {
  const router = useRouter();

  const handleAbStartTest = () => {
    onCloseAbTestInstructions();
  };

  return (
    <Flex
      h="full"
      px={4}
      direction="column"
      gap={8}
    >
      <Heading>Instructions</Heading>
      <Flex
        direction="column"
        gap={2}
      >
        <Text>
        In the upcoming sections, you will encounter a variety of statements and several mathematical problems. Your task is to solve them and select the correct answer.
        </Text>
      </Flex>

      <Flex direction="column" align="center" justify="center" minH="10vh" p={4}>
        <Text mb={4} textAlign="center">
          Please click 'Go ahead'.
        </Text>
        <Button onClick={handleAbStartTest} colorScheme="blue">
          Go ahead
        </Button>
      </Flex>
    </Flex>
  );
}
