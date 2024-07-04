import { useRouter } from "next/router";
import { useState } from "react";
import { useRadioGroup, Flex, Text, Button } from "@chakra-ui/react";

import TestProgress from "./test-progress";
import TestAnswerOption from "./test-answer-option";
import { saveToCsv, CsvData } from "../../lib/csv-utils";

import { personalityTest } from "../../data/personality-test";
import {
  TestAnswerOption as TestAnswer,
  getQuestionAnswerScore,
} from "../../lib/personality-test";
import useUserTestAnswersStore from "../../store/use-user-test-answers";

export default function TestQuestion() {
  const router = useRouter();
  const { userTestAnswers, setUserTestAnswers } = useUserTestAnswersStore();
  const [currentPersonalityTestIndex, setCurrentPersonalityTestIndex] = useState(0);
  const isUserAlreadyPickAnswer = userTestAnswers[currentPersonalityTestIndex] !== undefined;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "answer",
    defaultValue: String(userTestAnswers[currentPersonalityTestIndex] || ""), 
    onChange: (value) => {
      const newUserTestAnswers = [...userTestAnswers];
      setUserTestAnswers(newUserTestAnswers);
    },
  });

  function handleNextButtonClick() {
    setCurrentPersonalityTestIndex((prevIndex) =>
      prevIndex < personalityTest.length - 1 ? prevIndex + 1 : prevIndex
    );
  }

  function handlePreviousButtonClick() {
    setCurrentPersonalityTestIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  }

  function handleSubmitButtonClick() {
    const timestamp = Date.now();
    const testScores: CsvData[] = userTestAnswers.map((answer, index) => {
      const score = getQuestionAnswerScore(index + 1, String(answer));
  
      if (score === undefined) {
        throw new Error(`Score undefined for answer at index ${index}`);
      }
  
      return {
        sNo: index + 1,
        statement: personalityTest[index]?.question || "", // Ensure statement is string
        score: score,
      };
    });
  
    saveToCsv(testScores, `test_result_${timestamp}.csv`);
  
    router.replace("/"); // Redirect to home page after submission
  }
  

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
      <TestProgress />
      <Flex direction="column">
        <Text fontWeight="bold" align="center">
          #{currentPersonalityTestIndex + 1}
        </Text>
        <Text fontSize="lg" align="center">
          {personalityTest[currentPersonalityTestIndex]?.question}
        </Text>
      </Flex>
      <Flex w="full" gap={4} direction="column" {...getRootProps()}>
        {personalityTest[currentPersonalityTestIndex]?.answerOptions.map(
          (answerOption) => {
            const radioProps = getRadioProps({ value: answerOption.answer });
            return (
              <TestAnswerOption key={answerOption.answer} {...radioProps}>
                {answerOption.answer}
              </TestAnswerOption>
            );
          }
        )}
      </Flex>
      <Flex direction="row" w="full" gap={4}>
        <Button
          w="full"
          variant="outline"
          disabled={currentPersonalityTestIndex === 0}
          onClick={handlePreviousButtonClick}
        >
          Previous
        </Button>
        {isUserAlreadyPickAnswer &&
        currentPersonalityTestIndex === personalityTest.length - 1 ? (
          <Button
            w="full"
            colorScheme="primary"
            onClick={handleSubmitButtonClick}
          >
            Submit
          </Button>
        ) : (
          <Button
            w="full"
            colorScheme="primary"
            variant="outline"
            disabled={!isUserAlreadyPickAnswer}
            onClick={handleNextButtonClick}
          >
            Next
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
