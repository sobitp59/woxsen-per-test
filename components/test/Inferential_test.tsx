import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Flex, Text, Button, Progress, useRadioGroup } from "@chakra-ui/react";
import TestAnswerOption from "./test-answer-option";
import { inferentialAbilityQuestions } from "../../data/Inferential-test";
import InferentialAbilityScoring from "../score/InferentialAbilityScoring";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";

interface InferentialAbilityQuestionsProps {
  onComplete: (timeRecords: Record<string, string>) => void;
}

const InferentialAbilityQuestions: React.FC<InferentialAbilityQuestionsProps> = ({
  onComplete,
}) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; score?: number }>>({});
  const [showScores, setShowScores] = useState(false);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    setStartTime(dayjs()); 
  }, []);

  const currentQuestion = inferentialAbilityQuestions[currentQuestionIndex];
  const isUserAlreadyPickAnswer = answers[currentQuestion.no] !== undefined;

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'answer',
    defaultValue: answers[currentQuestion.no]?.answer || '',
    onChange: (value) => handleAnswerChange(value),
  });

  useEffect(() => {
    setValue(answers[currentQuestion.no]?.answer || '');
  }, [currentQuestionIndex, answers, setValue]);

  function handleAnswerChange(value: string) {
    const selectedOption = currentQuestion.options.find(option => option.answer === value);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion.no]: {
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

  // function handleGoAhead() {
  //   setShowScores(true);
    // onComplete()
  //   // router.push('/PersonalityScoresPage');
  // }

  
  
  async function handleGoAhead() {
    
    const transformedAnswer = Object.keys(answers).reduce((acc , key:any) => {
      console.log('ANSER ', answers[key])
      acc[key] = answers[key].answer;
      return acc;
    }, {})
      
    const finalAnswers = Object.keys(answers).map((key: any) => answers[key].answer)

    // const timestamp = Date.now();
    // const folderPath = 'personality'
    const endTime = dayjs();
    const elapsedTime = endTime.diff(startTime, 'seconds');
    const filename = `inferential_sheet.csv`;
    // const parsedAnswer = ans

    try {
      const response = await fetch("/api/save-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testScores: Object.values(transformedAnswer), filename, moduleType : 'Inferential', timeRecords: `${elapsedTime} seconds` })
      });


      console.log("RESPONSE ", response)


      if (!response.ok) {
        throw new Error("Failed to save inferential test");
      }

      const result = await response.json();
      console.log("CSV File saved successfully:", result.filename);

      // setShowScores(true);
      onComplete();
    } catch (error) {
      console.error("Error saving ineferential test:", error);
    }
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
      {/* {!showScores ? (
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
        <InferentialAbilityScoring answers={answers}  />
      )} */}
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
    </Flex>
  );
};

export default InferentialAbilityQuestions;