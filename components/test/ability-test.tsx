import React, { useState, useEffect } from 'react';
import { Flex, Text, Button, Progress, useRadioGroup } from '@chakra-ui/react';
import Image from 'next/image';
import { questions } from '../../data/ability-test';
import AbilityScoresPage from '../score/AbilityScoresPage';
import TestAnswerOption from './test-answer-option';

interface AbilityQuestionsProps {
  onComplete: () => void; 
}

export default function AbilityQuestions({ onComplete }: AbilityQuestionsProps) {
  if (questions.length === 0) {
    return <Text>No questions available.</Text>;
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentQuestionIndex] || { id: -1, text: '', options: [] };
  const isUserAlreadyPickAnswer = currentQuestion && answers[currentQuestion.id] !== undefined;

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'answer',
    defaultValue: answers[currentQuestion.id] || '',
    onChange: (value) => handleAnswerChange(value),
  });

  useEffect(() => {
    setValue(answers[currentQuestion.id] || '');
  }, [currentQuestionIndex, answers, setValue]);

  function handleAnswerChange(value: string) {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion.id]: value }));
  }

  function handleGoAhead() {
    onComplete();
  }

  function handleNextButtonClick() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // When the last question is answered, show the AbilityScoresPage
      // setCurrentQuestionIndex(questions.length); // This will trigger rendering of AbilityScoresPage
      handleGoAhead()
    }
  }

  function handlePreviousButtonClick() {
    setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Show the AbilityScoresPage component when the user reaches the end of the questions
  // if (currentQuestionIndex >= questions.length) {
  //   return <AbilityScoresPage answers={answers} onComplete={onComplete} />;
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
      <Flex direction="column" w="full" alignItems="center">
        <Text fontWeight="bold" align="center" mb={4}>
          #{currentQuestionIndex + 1}/{questions.length}
        </Text>
        {/* <Text fontSize="lg" align="center" mb={4}>
          {currentQuestion.text}
        </Text> */}
        <Text fontSize="lg" mb={4} whiteSpace="pre-line">
          {currentQuestion.text}
        </Text>
        {currentQuestion.image && (
          <Image
            src={currentQuestion.image}
            alt={`Question ${currentQuestion.id}`}
            width={500}
            height={300}
          />
        )}
        {currentQuestion.options.map((option) => {
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
          disabled={!isUserAlreadyPickAnswer}
          onClick={handleNextButtonClick}
        >
          {questions.length - 1 === currentQuestionIndex ? 'Submit' : 'Next'}
        </Button>
      </Flex>
    </Flex>
  );
}
