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

interface InferentialAbilityTestInstructionsProps {
  onCloseIAbTestInstructions: () => void;
}

export default function InferentialAbilityTestInstructions({ onCloseIAbTestInstructions }: InferentialAbilityTestInstructionsProps) {
  const router = useRouter();

  const handleIAbStartTest = () => {
    onCloseIAbTestInstructions();
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
        These paragraphs are based on specific situations, read them carefully. Select the option that seems most appropriate to you.
        </Text>
      </Flex>

      <Flex direction="column" align="center" justify="center" minH="10vh" p={4}>
        <Text mb={4} textAlign="center">
          Please click 'Go ahead'.
        </Text>
        <Button onClick={handleIAbStartTest} colorScheme="blue">
          Go ahead
        </Button>
      </Flex>
    </Flex>
  );
}
