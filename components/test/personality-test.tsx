import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Button,
  Progress,
  useRadioGroup,
} from "@chakra-ui/react";
import { personalityTest } from '../../data/personality-test';
import { TestQuestion } from '../../lib/personality-test';
import { calculateTraitScores } from "../score/Personality_Score";
import PersonalityScoresPage from "../score/PersonalityScoresPage";
import TestAnswerOption from "./test-answer-option";

interface PersonalityTestProps {
  onComplete: () => void;
}

const PersonalityTest: React.FC<PersonalityTestProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showScores, setShowScores] = useState(false);
  const [traitScores, setTraitScores] = useState<Record<string, number> | null>(null);

  const currentQuestion: TestQuestion = personalityTest[currentQuestionIndex];
  const isUserAlreadyPickAnswer = answers[currentQuestion?.no] !== undefined;

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'answer',
    defaultValue: answers[currentQuestion.no] || '',
    onChange: (value) => handleAnswerChange(value),
  });

  useEffect(() => {
    setValue(answers[currentQuestion.no] || '');
  }, [currentQuestionIndex, answers, setValue]);

  function handleAnswerChange(value: string) {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion.no]: value }));
  }

  function handleNextButtonClick() {

    if (currentQuestionIndex < personalityTest.length - 1) {
      if (isAttentivenessCheckPassed()) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      handleGoAhead();
    }
  }

  function isAttentivenessCheckPassed(): boolean {
    if (!currentQuestion.question.includes("attentiveness check")) {
      return true;
    }

    switch (currentQuestion.no) {
      case 3.5:
        return answers[currentQuestion.no] === "Strongly Agree";
      case 16.5:
        return answers[currentQuestion.no] === "Neutral";
      case 28.5:
        return answers[currentQuestion.no] === "Strongly Disagree";
      case 34.5:
        return answers[currentQuestion.no] === "Agree";
      case 49.5:
        return answers[currentQuestion.no] === "Disagree";
      case 55.5:
        return answers[currentQuestion.no] === "Neutral";
      default:
        return true;
    }
  }

  function handlePreviousButtonClick() {
    setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }

  async function handleGoAhead() {

    // const timestamp = Date.now();
    // const folderPath = 'personality'
    const filename = `personality_sheet.csv`;

    console.log('user TEST answers', answers)

    try {
      const response = await fetch("/api/save-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testScores: Object.values(answers), filename }),
      });


      console.log("RESPONSE ", response)


      if (!response.ok) {
        throw new Error("Failed to save personality test");
      }

      const result = await response.json();
      console.log("CSV File saved successfully:", result.filename);

      setShowScores(true);
      onComplete();
    } catch (error) {
      console.error("Error saving personality test:", error);
    }
  }

  function getDisplayedQuestionIndex(): number {
    let displayedIndex = 0;
    for (let i = 0; i <= currentQuestionIndex; i++) {
      if (Number.isInteger(personalityTest[i].no)) {
        displayedIndex++;
      }
    }
    return displayedIndex;
  }

  function getTotalQuestionCount(): number {
    return personalityTest.filter(q => Number.isInteger(q.no)).length;
  }

  const progress = (getDisplayedQuestionIndex() / getTotalQuestionCount()) * 100;

  console.log('TRAIT SCORES (personailty.tsx) ', traitScores)

  // if (showScores) {
  //   return (
  //     <PersonalityScoresPage
  //       traitScores={traitScores!}
  //     />
  //   );
  // }

  return (
    <Flex
      py={4}
      w="full"
      h="full"
      gap={8}
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Progress value={progress} w="80%" />
      <Flex direction="column">
        {Number.isInteger(currentQuestion.no) && (
          <Text fontWeight="bold" align="center">
            #{getDisplayedQuestionIndex()}/{getTotalQuestionCount()}
          </Text>
        )}
        <Text fontSize="lg" align="center">
          {currentQuestion.question}
        </Text>
      </Flex>
      <Flex w="full" gap={4} direction="column" {...getRootProps()}>
        {currentQuestion.answerOptions.map((option) => {
          const radioProps = getRadioProps({ value: option.answer });
          return (
            <TestAnswerOption key={option.answer} {...radioProps}>
              {option.answer}
            </TestAnswerOption>
          );
        })}
      </Flex>
      <Flex direction="row" w="full" gap={4}>
        <Button
          w="full"
          variant="outline"
          disabled={currentQuestionIndex === 0}
          onClick={handlePreviousButtonClick}
        >
          Previous
        </Button>
        <Button
          w="full"
          colorScheme="primary"
          variant="outline"
          disabled={!isUserAlreadyPickAnswer || !isAttentivenessCheckPassed()}
          onClick={handleNextButtonClick}
        >
          {currentQuestionIndex === getTotalQuestionCount() + 5 ? "Submit" : "Next"}
          {/* {currentQuestionIndex + 1 === getTotalQuestionCount() ? "Submit" : "Next"} */}
        </Button>
      </Flex>
    </Flex>
  );
}

export default PersonalityTest;