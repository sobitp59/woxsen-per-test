import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Flex, Text, Button, Progress, useRadioGroup } from "@chakra-ui/react";
import TestAnswerOption from "./test-answer-option";
import { inferentialAbilityQuestions } from "../../data/Inferential-test";
import InferentialAbilityScoring from "../score/InferentialAbilityScoring";
import { Link } from 'react-router-dom';

interface InferentialAbilityQuestionsProps {
  onComplete: () => void;
}

const InferentialAbilityQuestions: React.FC<InferentialAbilityQuestionsProps> = ({
  onComplete,
}) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; score?: number }>>({});
  const [showScores, setShowScores] = useState(false);

  const currentQuestion = inferentialAbilityQuestions[currentQuestionIndex];
  const isUserAlreadyPickAnswer = answers[currentQuestion.id] !== undefined;

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'answer',
    defaultValue: answers[currentQuestion.id]?.answer || '',
    onChange: (value) => handleAnswerChange(value),
  });

  useEffect(() => {
    setValue(answers[currentQuestion.id]?.answer || '');
  }, [currentQuestionIndex, answers, setValue]);

  function handleAnswerChange(value: string) {
    const selectedOption = currentQuestion.options.find(option => option.answer === value);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion.id]: {
        answer: value,
        score: selectedOption?.score || 0, // Default score to 0 if not found (optional)
      },
    }));
  }

  function handleNextButtonClick() {
    if (currentQuestionIndex < inferentialAbilityQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleGoAhead();
    }
  }

  function handlePreviousButtonClick() {
    setCurrentQuestionIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : prevIndex);
  }

  function handleGoAhead() {
    setShowScores(true);
    onComplete();
  }

  const progress = ((currentQuestionIndex + 1) / inferentialAbilityQuestions.length) * 100;

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
      {!showScores ? (
        <>
          <Progress value={progress} w="80%" />
          <Flex direction="column" w="full" alignItems="center">
            <Text fontWeight="bold" align="center" mb={4}>
              #{currentQuestionIndex + 1}/{inferentialAbilityQuestions.length}
            </Text>
            <Text fontSize="lg" align="center" mb={4}>
              {currentQuestion.text}
            </Text>
            <Flex w="full" gap={4} direction="column" {...getRootProps()}>
              {currentQuestion.options.map(option => {
                const radioProps = getRadioProps({ value: option.answer });
                return (
                  <TestAnswerOption key={option.answer} {...radioProps}>
                    {option.answer}
                  </TestAnswerOption>
                );
              })}
            </Flex>
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
              disabled={!isUserAlreadyPickAnswer}
              onClick={handleNextButtonClick}
            >
              {inferentialAbilityQuestions.length - 1 === currentQuestionIndex ? 'Submit' : 'Next'}
            </Button>
          </Flex>
        </>
      ) : (
        <InferentialAbilityScoring answers={answers} />
      )}
    </Flex>
  );
};

export default InferentialAbilityQuestions;