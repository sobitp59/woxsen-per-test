// components/test/test-instructions.tsx
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

interface TestInstructionsProps {
  onCloseTestInstructions: () => void;
}

export default function TestInstructions({ onCloseTestInstructions }: TestInstructionsProps) {
  const router = useRouter();
  const [showTransition, setShowTransition] = useState(false);

  const handleStartTest = () => {
    onCloseTestInstructions();
  };

  // const handlepersonality = () => {
  //   setShowTransition(true)
  // };
  // if (showTransition) {
  //   return (
  //     <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
  //       <Text mb={4} textAlign="center">
  //         Now, you're moving to the Personality Testing phase. Please click 'Go ahead'.
  //       </Text>
  //       <Button onClick={handleStartTest} colorScheme="blue">
  //         Go ahead
  //       </Button>
  //     </Flex>
  //   );
  // }

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
          There are 60 questions in this test which should only take 15 minutes or so. Here are several
          hints about how to complete this test:
        </Text>
        <UnorderedList spacing={2}>
          <ListItem>
            There are no right answers to any of these questions.
          </ListItem>
          <ListItem>
            Answer the questions quickly, do not over-analyze them. Some seem
            worded poorly. Go with what feels best.
          </ListItem>
          <ListItem>
          Answer the questions as &quot;the way you are&quot;, not &quot;the way you&apos;d like
          to be seen by others&quot;.
          </ListItem>
        </UnorderedList>
      </Flex>
      {/* <Button
        w="min-content"
        colorScheme="red"
        alignSelf="flex-end"
        onClick={handlepersonality}
      >
        Okay, I got it!
      </Button> */}
      <Flex direction="column" align="center" justify="center" minH="10vh" p={4}>
        <Text mb={4} textAlign="center">
          Please click &apos;Go ahead&apos;.
        </Text>
        <Button onClick={handleStartTest} colorScheme="blue">
          Go ahead
        </Button>
      </Flex>
    </Flex>
  );
}
