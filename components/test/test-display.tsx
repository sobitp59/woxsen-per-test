import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

import TestMenu from "./test-menu";
import TestInstructions from "./test-instructions";
import AbilityTestInstructions from "./ability_test_instruction";
import InferentialAbilityTestInstructions from "./Inferential_test_instruction";
import TestQuestion from "./test-question";
import BasicInfoQuestions from "./basic-info-questions";
import PersonalityTest from "./personality-test";
import AbilityQuestions from "./ability-test";
import InferentialAbilityQuestions from "./Inferential_test";
import PersonalityScoresPage from "../score/PersonalityScoresPage";
import { calculateTraitScores } from "../score/Personality_Score";
import { personalityTest } from "../../data/personality-test";
import AbilityScoresPage from "../score/AbilityScoresPage";

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

  const handlePersonalityTestCompleted = () => {
    setShowPersonalityTest(false);
    setPersonalityTestCompleted(true);
    setAbShowTestInstructions(true); 
  };

  const handleAbilityTestingCompleted = () => {
    setShowAbilityTesting(false);
    setAbilityTestingCompleted(true);
    setIAbShowTestInstructions(true); 
    setShowInferentialAbilityTesting(false)// Show Inferential Ability Test instructions after completing Ability Testing
  };

  const handleInferentialAbilityTestingCompleted = () => {
    setShowInferentialAbilityTesting(false);
    setInferentialAbilityTestingCompleted(true);
    setpersonalityScore(true)
  };

  const handleShowScore = () => {
    setpersonalityScore(false)
    setShowScore(true)
  }

  const personalityTraitScores = calculateTraitScores(personalityTest, {
    1 : "Neutral",
    2 : "Agree",
    3 : "Strongly Disagree",
    4 : "Strongly Disagree",
    5 : "Strongly Disagree",
    6 : "Strongly Disagree",
    30 : "Agree"
  })
  console.log('trait scores', personalityTraitScores)

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
       />
      <Flex
        w={{
          lg: "50%",
          base: "100%",
        }}
        h="full"
      >
        {showBasicInfo && (
          <BasicInfoQuestions onComplete={handleBasicInfoCompleted} />
        )}
        {showTestInstructions && (
          <TestInstructions onCloseTestInstructions={handleCloseTestInstructions} />
        )}
        {showPersonalityTest && (
          <PersonalityTest onComplete={handlePersonalityTestCompleted} />
        )}
        {showAbTestInstructions && (
          <AbilityTestInstructions onCloseAbTestInstructions={handleCloseAbTestInstructions} />
        )}
        {showAbilityTesting && (
          <AbilityQuestions onComplete={handleAbilityTestingCompleted} />
        )}
        {abilityTestingCompleted && showIAbTestInstructions &&(
          <InferentialAbilityTestInstructions onCloseIAbTestInstructions={handleCloseIAbTestInstructions} />
        )}
        {abilityTestingCompleted && showInferentialAbilityTesting && (
          <InferentialAbilityQuestions onComplete={handleInferentialAbilityTestingCompleted} />
        )}
        {basicInfoCompleted && personalityTestCompleted && abilityTestingCompleted && inferentialabilityTestingCompleted && (
          <TestQuestion />
        )}
        {personalityScore && <PersonalityScoresPage traitScores={personalityTraitScores} onComplete={handleShowScore}/>}
        {showScore && <AbilityScoresPage answers={[]}/>}
      </Flex>
    </Flex>
  );
}
