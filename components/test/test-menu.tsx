import { Flex, Button } from "@chakra-ui/react";
import { RiInformationLine } from "react-icons/ri";
import TestTimer from "./test-timer";

interface TestMenuProps {
  onShowInstructionsButtonClick: () => void;
  onShowAbInstructionsButtonClick: () => void; // Add new prop for Ability Test Instructions
  onShowIAbInstructionsButtonClick: () => void;
  showAbilityTesting: boolean; // Add prop to indicate if Ability Testing phase is active
  showInferentialAbilityTesting: boolean;
  personalityScore: boolean;
  showScore: boolean; 
  showTestInstructions: boolean;
  showAbTestInstructions : boolean;
  showIAbTestInstructions: boolean
}

export default function TestMenu(props: TestMenuProps) {
  const { onShowInstructionsButtonClick, onShowAbInstructionsButtonClick, onShowIAbInstructionsButtonClick, showAbilityTesting, showInferentialAbilityTesting ,personalityScore, showScore,showTestInstructions, showAbTestInstructions ,showIAbTestInstructions} = props;

  const handleClick = () => {
    if (showAbilityTesting) {
      onShowAbInstructionsButtonClick(); // Trigger Ability Test Instructions function
    } else if (showInferentialAbilityTesting) {
      onShowIAbInstructionsButtonClick(); // Trigger Inferential Ability Test Instructions function
    } else {
      onShowInstructionsButtonClick(); // Trigger Personality Test or Basic Info function
    }
  };

  return !showScore && !personalityScore && !showTestInstructions &&  !showAbTestInstructions && !showIAbTestInstructions ? (
    <Flex
      width="full"
      my={2}
      px={4}
      direction="column"
      justifyContent="center"
      alignItems="flex-end"
      gap={2}
    >
      <Flex>
        <Button
          aria-label="instructions"
          variant="outline"
          leftIcon={<RiInformationLine size={24} />}
          onClick={handleClick}
        >
          Instructions
        </Button>
        {/* <TestTimer /> */}
      </Flex>
    </Flex>
  ) : null;
}
