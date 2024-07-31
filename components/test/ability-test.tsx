import React, { useState, useEffect } from 'react';
import { Flex, Text, Button, Progress, useRadioGroup } from '@chakra-ui/react';
import Image from 'next/image';
import { questions } from '../../data/ability-test';
import AbilityScoresPage from '../score/AbilityScoresPage';
import TestAnswerOption from './test-answer-option';
import dayjs from 'dayjs';

interface AbilityQuestionsProps {
  onComplete: (timeRecords: Record<string, string>) => void; 
}
export default function AbilityQuestions({ onComplete }: AbilityQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [setStartTimes, setSetStartTimes] = useState<Record<number, dayjs.Dayjs>>({});
  const [setElapsedTimes, setSetElapsedTimes] = useState<Record<number, string>>({});
  const [lastFileNumber, setLastFileNumber] = useState<number>(0);

  useEffect(() => {
    const initialTime = dayjs();
    setStartTime(initialTime);
    setSetStartTimes(prev => ({ ...prev, [1]: initialTime }));
    fetchLatestFileNumber();
  }, []);
  

  const fetchLatestFileNumber = async () => {
    try {
      const response = await fetch('/api/get-file-numbers');
      if (!response.ok) {
        throw new Error('Failed to fetch latest file number');
      }
      const data = await response.json();
      setLastFileNumber(data.latestPsychometricFileNumber || 0);
    } catch (error) {
      console.error('Error fetching latest file number:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || { no: -1, text: '', options: [] };
  const isUserAlreadyPickAnswer = currentQuestion && answers[currentQuestion.no] !== undefined;

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

  async function handleGoAhead() {
    if (startTime === null) {
      console.error("Start time is not set");
      return;
    }
  
    const endTime = dayjs();
    const totalElapsedTime = endTime.diff(startTime, 'seconds');
  
    // Prepare time records
    const setCount = Math.ceil(questions.length / 4);
    const completeTimeRecordsArray = [];
    for (let i = 1; i <= setCount; i++) {
      const elapsedTime = setElapsedTimes[i] || '0 seconds';
      completeTimeRecordsArray.push(`Set ${i}: ${elapsedTime}`);
    }
    completeTimeRecordsArray.push(`Total: ${totalElapsedTime} seconds`);
  
    const completeTimeRecordsString = completeTimeRecordsArray.join(', ');
  
    console.log(completeTimeRecordsString);
  
    const newFileNumber = lastFileNumber + 1;
    const filename = `psychometricability_sheet_${newFileNumber}.csv`;
  
    try {
      const response = await fetch("/api/save-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          testScores: Object.values(answers), 
          filename, 
          moduleType: 'Ability', 
          timeRecords: completeTimeRecordsString
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save personality test");
      }
  
      const result = await response.json();
      console.log("CSV File saved successfully:", result.filename);
  
      onComplete(completeTimeRecordsString);
    } catch (error) {
      console.error("Error saving personality test:", error);
    }
  }
  
  function handleNextButtonClick() {
    const nextIndex = currentQuestionIndex + 1;
  
    if (nextIndex % 4 === 0) {
      const endTime = dayjs();
      const setNumber = nextIndex / 4;
      const startTimeForSet = setSetStartTimes[setNumber];
      if (startTimeForSet) {
        const setElapsedTime = endTime.diff(startTimeForSet, 'seconds');
        console.log(`Elapsed time for set ${setNumber}: ${setElapsedTime} seconds`);
  
        setSetElapsedTimes(prev => ({ ...prev, [setNumber]: `${setElapsedTime} seconds` }));
        setSetStartTimes(prev => ({ ...prev, [setNumber]: endTime })); // Update start time for the next set
      }
    }
  
    if (nextIndex >= questions.length) {
      const totalElapsedTime = dayjs().diff(startTime, 'seconds');
  
      // Ensure that all sets up to the last one are accounted for
      const setCount = Math.ceil(questions.length / 4);
      for (let i = 1; i <= setCount; i++) {
        if (!setElapsedTimes[i]) {
          setSetElapsedTimes(prev => ({ ...prev, [i]: '0 seconds' }));
        }
      }
  
      handleGoAhead();
    } else {
      setCurrentQuestionIndex(nextIndex);
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
        {currentQuestion.no === 5 && (
          <Flex direction="column" alignItems="center" w="100%" mb={4}>
            {/* <Text fontWeight="bold" fontSize="lg" mb={2}>
              From the below table, answer the question:
            </Text> */}
            <table style={{ borderCollapse: 'collapse', width: '80%', marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Drink</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Primary School</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Secondary School</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid black', padding: '8px' }}>Juice</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>$1.50</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>21</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>45</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '8px' }}>Water</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>$0.80</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>12</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>115</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '8px' }}>Coca-cola</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>$1.20</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>33</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>51</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '8px' }}>Sprite</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>$1.20</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>45</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>45</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '8px' }}>Milk</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>$1.40</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>9</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>12</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid black', padding: '8px' }}>Chocolate Milk</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>$1.90</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>30</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>32</td>
                </tr>
              </tbody>
            </table>
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              What is the daily turnover for the drink vendor in the Secondary School?
            </Text>
          </Flex>
        )}
        {currentQuestion.image && (
          <Image
            src={currentQuestion.image}
            alt={`Question ${currentQuestion.no}`}
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