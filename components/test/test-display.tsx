import { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

import TestMenu from "./test-menu";
import TestInstructions from "./test-instructions";
import AbilityTestInstructions from "./ability_test_instruction";
import InferentialAbilityTestInstructions from "./Inferential_test_instruction";
// import TestQuestion from "./test-question";
import BasicInfoQuestions from "./basic-info-questions";
import PersonalityTest from "./personality-test";
import AbilityQuestions from "./ability-test";
import InferentialAbilityQuestions from "./Inferential_test";
import PersonalityScoresPage from "../score/PersonalityScoresPage";
import { calculateTraitScores } from "../score/Personality_Score";
import { personalityTest } from "../../data/personality-test";
import AbilityScoresPage from "../score/AbilityScoresPage";
import TestTimer from "./test-timer";
import dayjs from "dayjs";

export default function TestDisplay() {
  const [showTestInstructions, setShowTestInstructions] = useState(false);
  const [showAbTestInstructions, setAbShowTestInstructions] = useState(false);
  const [showIAbTestInstructions, setIAbShowTestInstructions] = useState(false);
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const [showAbilityTesting, setShowAbilityTesting] = useState(false);
  const [showInferentialAbilityTesting, setShowInferentialAbilityTesting] = useState(false);
  const [basicInfoCompleted, setBasicInfoCompleted] = useState(false);
  const [personalityTestCompleted, setPersonalityTestCompleted] = useState(false);
  const [abilityTestingCompleted, setAbilityTestingCompleted] = useState(false);
  const [inferentialabilityTestingCompleted, setInferentialAbilityTestingCompleted] = useState(false);
  const [personalityScore,setpersonalityScore] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [traitScores, setTraitScores] = useState<Record<string, number> | null>(null);
  const [timeRecords, setTimeRecords] = useState<Record<string, string>>({});

  const handleShowInstructionsButtonClick = () => {
    setShowTestInstructions(true);
    setShowBasicInfo(false);
    setShowPersonalityTest(false); 
    setShowAbilityTesting(false);
  };

  const handleShowAbInstructionsButtonClick = () => {
    setAbShowTestInstructions(true);
    setShowBasicInfo(false);
    setShowPersonalityTest(false);
    setShowAbilityTesting(false); 
  };

  const handleShowIAbInstructionsButtonClick = () => {
    setIAbShowTestInstructions(true);
    setShowBasicInfo(false);
    setShowPersonalityTest(false);
    setShowAbilityTesting(false); 
    setShowInferentialAbilityTesting(false);
  };

  const handleCloseTestInstructions = () => {
    setShowTestInstructions(false);
    setShowPersonalityTest(true);
  };

  const handleCloseAbTestInstructions = () => {
    setAbShowTestInstructions(false);
    setShowAbilityTesting(true);
  };

  const handleCloseIAbTestInstructions = () => {
    setIAbShowTestInstructions(false);
    setShowInferentialAbilityTesting(true);
  };

  const handleBasicInfoCompleted = () => {
    setShowBasicInfo(false);
    setBasicInfoCompleted(true);
    setShowTestInstructions(true);
  };

  const handlePersonalityTestCompleted = (scores: Record<number, string>) => {
    const traitScores = calculateTraitScores(personalityTest, scores);
    setTraitScores(traitScores);
    setShowPersonalityTest(false);
    setPersonalityTestCompleted(true);
    setAbShowTestInstructions(true);
  };

  const handleAbilityTestingCompleted = () => {
    setShowAbilityTesting(false);
    setAbilityTestingCompleted(true);
    setIAbShowTestInstructions(true); 
    setShowScore(false);
    setShowInferentialAbilityTesting(false)// Show Inferential Ability Test instructions after completing Ability Testing
  };

  const handleInferentialAbilityTestingCompleted = () => {
    setShowInferentialAbilityTesting(false);
    setInferentialAbilityTestingCompleted(true);
    setpersonalityScore(true);
    setShowPersonalityTest(false);
  };

  const handleShowScore = () => {
    setIAbShowTestInstructions(false);
    setpersonalityScore(false);
    setShowScore(true);
    setShowPersonalityTest(false);
  }

  // const personalityTraitScores = calculateTraitScores(personalityTest, {})
  // console.log('trait scores', personalityTraitScores)

  const handleTimeElapsed = (section: string, elapsedTime: dayjs.Dayjs) => {
    const formattedTime = elapsedTime.format("mm:ss");
    setTimeRecords((prev) => ({ ...prev, [section]: formattedTime }));
  };
  
  return (
    <Flex
      alignSelf="flex-start"
      w="full"
      h="full"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      px={1}
    >
      <TestMenu
         onShowInstructionsButtonClick={handleShowInstructionsButtonClick}
         onShowAbInstructionsButtonClick={handleShowAbInstructionsButtonClick}
         onShowIAbInstructionsButtonClick={handleShowIAbInstructionsButtonClick} // Pass new handler for Inferential Ability Test instructions
         showAbilityTesting={showAbilityTesting}
         showInferentialAbilityTesting={showInferentialAbilityTesting} // Pass prop to indicate Inferential Ability Testing phase
         personalityScore={personalityScore}
         showScore={showScore}
         showTestInstructions={showTestInstructions}
         showAbTestInstructions= {showAbTestInstructions}  
         showIAbTestInstructions= {showIAbTestInstructions}
       />
      <Flex
        w={{
          lg: "50%",
          base: "100%",
        }}
        h="full"
      >
        {showBasicInfo && (
         <> 
         <BasicInfoQuestions onComplete={handleBasicInfoCompleted} />
         <Box position="relative">
         <TestTimer running={showBasicInfo} onEnd={(time) => handleTimeElapsed("BasicInfo", time)} />
         </Box>
          </>
        )}
        {showTestInstructions && (
          <TestInstructions onCloseTestInstructions={handleCloseTestInstructions} />
        )}
        {showPersonalityTest && (
          <>
          <PersonalityTest onComplete={handlePersonalityTestCompleted} />
          <Box position="relative">
          <TestTimer running={showPersonalityTest} onEnd={(time) => handleTimeElapsed("Personality", time)} />
          </Box>
          </>
        )}
        {showAbTestInstructions && (
          <AbilityTestInstructions onCloseAbTestInstructions={handleCloseAbTestInstructions} />
        )}
        {showAbilityTesting && (
          <>
          <AbilityQuestions onComplete={handleAbilityTestingCompleted} />
          <Box position="relative">
          <TestTimer running={showAbilityTesting} onEnd={(time) => handleTimeElapsed("Ability", time)} />
          </Box>
          </>
        )}
        {abilityTestingCompleted && showIAbTestInstructions &&(
          <InferentialAbilityTestInstructions onCloseIAbTestInstructions={handleCloseIAbTestInstructions} />
        )}
        {abilityTestingCompleted && showInferentialAbilityTesting && (
          <>
          <InferentialAbilityQuestions onComplete={handleInferentialAbilityTestingCompleted} />
          <Box position="relative">
          <TestTimer running={showInferentialAbilityTesting} onEnd={(time) => handleTimeElapsed("Inferential", time)} />
          </Box>
          </>
        )}
        {/* {basicInfoCompleted && personalityTestCompleted && abilityTestingCompleted && inferentialabilityTestingCompleted && (
          <TestQuestion />
        )} */}
        {/* {traitScores && <PersonalityScoresPage traitScores={traitScores} onComplete={handleShowScore} />} */}
        {traitScores && personalityScore && <PersonalityScoresPage traitScores={traitScores} onComplete={handleShowScore}/>}
        {showScore && <AbilityScoresPage answers={[]}/>}
      </Flex>
    </Flex>
  );
}
