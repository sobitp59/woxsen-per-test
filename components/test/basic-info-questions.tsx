import { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  Input,
  Button,
  Progress,
  useRadioGroup,
} from '@chakra-ui/react';
import TestAnswerOption from './test-answer-option';

// Define the structure of our questions
interface Question {
  id: number;
  text: string;
  type: 'text' | 'select' | 'dual-text';
  options?: string[];
}

// Define all the questions
const questions: Question[] = [
  { id: 1, text: 'Age:', type: 'text' },
  { id: 2, text: 'Country:', type: 'text' },
  { id: 3, text: 'Residing State:', type: 'text' },
  { id: 4, text: 'Gender:', type: 'select', options: ['Male', 'Female', 'Transgender', 'Non-Binary', 'Prefer not to respond'] },
  { id: 5, text: 'If English is not your first language, how would you rate your ability to understand English?', type: 'select', options: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Fluent'] },
  { id: 6, text: 'Highest level of Education?', type: 'select', options: ['Higher Secondary', 'Pursuing Bachelor’s', 'Undergraduate', 'Pursuing Master’s'] },
  { id: 7, text: 'Which Secondary education board did you follow?', type: 'select', options: ['CBSE', 'ICSE', 'IGCSE', 'State Board'] },
  { id: 8, text: 'Which Higher Secondary education board did you follow?', type: 'select', options: ['CBSE', 'ICSE', 'IGCSE', 'State Board'] },
  { id: 9, text: 'What is your Birth Order?', type: 'select', options: ['Oldest Child', 'Middle Child', 'Youngest Child', 'Only Child'] },
  { id: 10, text: 'How many siblings do you have?', type: 'text' },
  { id: 11, text: 'How would you categorize your socio-economic background?', type: 'select', options: ['Below 2 Lakhs (per annum)', '2 lakhs- 5 lakhs (per annum)', '5 lakhs-10 lakhs (per annum)', '10 lakhs-20 lakhs (per annum)', 'above 20 lakhs (per annum)'] },
  { id: 12, text: 'How would you describe your family structure?', type: 'select', options: ['Nuclear', 'Joint', 'Single-Parent'] },
  { id: 13, text: 'Highest level of education completed by your parents (both mother and father)?', type: 'dual-text' },
  { id: 14, text: 'Did your family move often when you were growing up?', type: 'select', options: ['Yes, very often', 'Yes, occasionally', 'No, we lived in the same place throughout my childhood'] },
  { id: 15, text: 'Have you ever received counseling in the past?', type: 'select', options: ['Yes', 'No'] },
  { id: 16, text: 'Do you have a history of medical illness or physical injuries?', type: 'text' },
];

interface BasicInfoQuestionsProps {
  onComplete: () => void;
}

export default function BasicInfoQuestions({ onComplete }: BasicInfoQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [dualTextAnswers, setDualTextAnswers] = useState<{ mother?: string; father?: string }>({});
  const [counselingReason, setCounselingReason] = useState('');
  const [counselingReason7, setCounselingReason7] = useState('');
  const [counselingReason8, setCounselingReason8] = useState('');

  const currentQuestion = questions[currentQuestionIndex];

  const isUserAlreadyPickAnswer = () => {
    if (currentQuestion.id === 13) {
      return dualTextAnswers.mother && dualTextAnswers.father;
    } else if (currentQuestion.id === 14) {
      return answers[14] !== undefined;
    } else if (currentQuestion.id === 15) {
      return answers[15] === 'Yes' ? counselingReason.trim() !== '' : answers[15] !== undefined;
    } else if (currentQuestion.id === 7) {
      return answers[7] === 'State Board' ? counselingReason7.trim() !== '' : answers[7] !== undefined;
    } else if (currentQuestion.id === 8) {
      return answers[8] === 'State Board' ? counselingReason8.trim() !== '' : answers[8] !== undefined;
    }
    return answers[currentQuestion.id] !== undefined;
  }

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: "answer",
    defaultValue: answers[currentQuestion.id] || "",
    onChange: (value) => handleAnswerChange(value),
  });

  useEffect(() => {
    setValue(answers[currentQuestion.id] || "");
  }, [currentQuestionIndex, answers, setValue]);

  function handleAnswerChange(value: string) {
    if (currentQuestion.id === 15) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [15]: value,
      }));

      if (value === 'Yes') {
        setCounselingReason('');
      } else {
        setCounselingReason(''); 
      }
    } else if (currentQuestion.id === 13) {
      setDualTextAnswers(prev => ({ ...prev, mother: value }));
    } else if (currentQuestion.id === 14) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [14]: value,
      }));
    } else if (currentQuestion.id === 7) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [7]: value,
      }));
      if (value === 'State Board') {
        setCounselingReason7('');
      } else {
        setCounselingReason7('');
      }
    } else if (currentQuestion.id === 8) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [8]: value,
      }));
      if (value === 'State Board') {
        setCounselingReason8('');
      } else {
        setCounselingReason8('');
      }
    } else {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.id]: value,
      }));
    }
  }

  function handleCounselingReasonChange(value: string) {
    setCounselingReason(value);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [15]: 'Yes',
    }));
  }

  function handlespecify(value: string) {
    setCounselingReason7(value);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [7]: 'State Board',
    }));
  }

  function handleHighersecondaryeducation(value: string) {
    setCounselingReason8(value);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [8]: 'State Board',
    }));
  }

  function handleDualTextChange(field: 'mother' | 'father', value: string) {
    setDualTextAnswers(prev => ({ ...prev, [field]: value }));
  }

  function handleNextButtonClick() {
    if (currentQuestionIndex === 14 && answers[15] === 'Yes') {
      setCurrentQuestionIndex(15);
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleGoAhead();
    }
  }

  function handlePreviousButtonClick() {
    if (currentQuestionIndex === 15 && answers[15] === 'Yes') {
      setCurrentQuestionIndex(14);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : prevIndex);
    }
  }

  console.log('DEMO ANSWERS ', answers)

  function handleGoAhead() {
    onComplete();
  }

  // async function handleGoAhead() {

  //   // const timestamp = Date.now();
  //   // const folderPath = 'personality'
  //   const filename = `demographic_sheet.csv`;

  //   console.log('user TEST answers', answers)

  //   try {
  //     const response = await fetch("/api/save-csv", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ testScores: Object.values(answers), filename }),
  //     });


  //     console.log("RESPONSE ", response)


  //     if (!response.ok) {
  //       throw new Error("Failed to save personality test");
  //     }

  //     const result = await response.json();
  //     console.log("CSV File saved successfully:", result.filename);

  //     // setShowScores(true);
  //     onComplete();
  //   } catch (error) {
  //     console.error("Error saving personality test:", error);
  //   }
  // }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
        <Text fontWeight="bold" align="center">
          #{currentQuestionIndex + 1}/{questions.length}
        </Text>
        <Text fontSize="lg" align="center">
          {currentQuestion.text}
        </Text>
      </Flex>
      <Flex w="full" gap={4} direction="column" {...getRootProps()}>
        {currentQuestion.type === 'text' ? (
          <Input
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        ) : currentQuestion.type === 'select' && currentQuestion.options ? (
          <>
            {currentQuestion.options.map((option) => {
              const radioProps = getRadioProps({ value: option });
              return (
                <TestAnswerOption key={option} {...radioProps}>
                  {option}
                </TestAnswerOption>
              );
            })}
            {currentQuestion.id === 7 && answers[7] === 'State Board' && (
              <Input
                placeholder="State Board (please specify- )"
                value={counselingReason7}
                onChange={(e) => handlespecify(e.target.value)}
              />
            )}
            {currentQuestion.id === 8 && answers[8] === 'State Board' && (
              <Input
                placeholder="State Board (please specify- )"
                value={counselingReason8}
                onChange={(e) => handleHighersecondaryeducation(e.target.value)}
              />
            )}
            {currentQuestion.id === 15 && answers[15] === 'Yes' && (
              <Input
                placeholder="If yes, please specify why"
                value={counselingReason}
                onChange={(e) => handleCounselingReasonChange(e.target.value)}
              />
            )}
          </>
        ) : currentQuestion.type === 'dual-text' ? (
          <Flex direction="column" gap={4}>
            <Input
              placeholder="Mother's Education Level"
              value={dualTextAnswers.mother || ''}
              onChange={(e) => handleDualTextChange('mother', e.target.value)}
            />
            <Input
              placeholder="Father's Education Level"
              value={dualTextAnswers.father || ''}
              onChange={(e) => handleDualTextChange('father', e.target.value)}
            />
          </Flex>
        ) : null}
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
          disabled={!isUserAlreadyPickAnswer()}
          onClick={handleNextButtonClick}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Flex>
    </Flex>
  );
}