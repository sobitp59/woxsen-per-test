import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Input,
  Button,
  Progress,
  useRadioGroup,
} from "@chakra-ui/react";
import TestAnswerOption from "./test-answer-option";
import { DemographicQuestions } from "../../data/demographic-test";
import dayjs from "dayjs";

// Define the structure of our DemographicQuestions

interface BasicInfoQuestionsProps {
  onComplete: (onTimeElapsed: Record<string, string>) => void;
}

export default function BasicInfoQuestions({
  onComplete,
}: BasicInfoQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<
      number,
      | string
      | { answer: string; specification: string }
      | { mother: string; father: string }
      | undefined
    >
  >({});
  const [dualTextAnswers, setDualTextAnswers] = useState<{
    mother?: string;
    father?: string;
  }>({});
  const [counselingReason, setCounselingReason] = useState("");
  const [counselingReason7, setCounselingReason7] = useState("");
  const [counselingReason8, setCounselingReason8] = useState("");
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null); // Track start time
  const [lastFileNumber, setLastFileNumber] = useState<number>(0);
  useEffect(() => {
    setStartTime(dayjs());
    fetchLatestFileNumber();
  }, []);

  const fetchLatestFileNumber = async () => {
    try {
      const response = await fetch(
        "https://woxsen-per-test-gvif4bv3a-sobitprasads-projects.vercel.app/api/get-file-numbers"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch latest file number");
      }
      const data = await response.json();
      setLastFileNumber(data.latestDemographicFileNumber || 0);
    } catch (error) {
      console.error("Error fetching latest file number:", error);
    }
  };

  const currentQuestion = DemographicQuestions[currentQuestionIndex];

  const isUserAlreadyPickAnswer = () => {
    if (currentQuestion.no === 13) {
      return dualTextAnswers.mother && dualTextAnswers.father;
    } else if (currentQuestion.no === 14) {
      return answers[14] !== undefined;
    } else if (currentQuestion.no === 15) {
      return answers[15] === "Yes"
        ? counselingReason.trim() !== ""
        : answers[15] !== undefined;
    } else if (currentQuestion.no === 7) {
      return answers[7] === "State Board"
        ? counselingReason7.trim() !== ""
        : answers[7] !== undefined;
    } else if (currentQuestion.no === 8) {
      return answers[8] === "State Board"
        ? counselingReason8.trim() !== ""
        : answers[8] !== undefined;
    }
    return answers[currentQuestion.no] !== undefined;
  };

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: "answer",
    // defaultValue: answers[currentQuestion.no] || "",
    defaultValue:
      typeof answers[currentQuestion.no] === "string"
        ? (answers[currentQuestion.no] as string)
        : "",
    onChange: (value) => handleAnswerChange(value),
  });

  // useEffect(() => {
  //   setValue(answers[currentQuestion.no] || "");
  // }, [currentQuestionIndex, answers, setValue]);
  useEffect(() => {
    const answer = answers[currentQuestion.no];
    if (typeof answer === "string") {
      setValue(answer);
    } else if (typeof answer === "object" && "answer" in answer) {
      setValue(answer.answer);
    } else {
      setValue("");
    }
  }, [currentQuestionIndex, answers, setValue, currentQuestion.no]);

  function handleAnswerChange(value: string) {
    console.log("DEMO VALUE ", value);

    if (currentQuestion.no === 15) {
      if (value === "Yes") {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [15]: { answer: value, specification: counselingReason },
        }));
        setCounselingReason("");
      } else if (value === "No") {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [15]: { answer: value, specification: "" },
        }));
        setCounselingReason("");
      }
    } else if (currentQuestion.no === 13) {
      setDualTextAnswers((prev) => ({ ...prev, mother: value }));
    } else if (currentQuestion.no === 14) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [14]: value,
      }));
    } else if (currentQuestion.no === 7) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [7]: { answer: value, specification: counselingReason7 || "" },
      }));
    } else if (currentQuestion.no === 8) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [8]: { answer: value, specification: counselingReason8 || "" },
      }));
    } else {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.no]: value,
      }));
    }
  }

  function handleCounselingReasonChange(value: string) {
    setCounselingReason(value);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [15]: { answer: "Yes", specification: value },
    }));
  }

  function handlespecify(value: string) {
    setCounselingReason7(value);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [7]: { answer: "State Board", specification: value },
    }));
  }

  function handleHighersecondaryeducation(value: string) {
    setCounselingReason8(value);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [8]: { answer: "State Board", specification: value },
    }));
  }

  function handleDualTextChange(field: "mother" | "father", value: string) {
    setDualTextAnswers((prev) => ({ ...prev, [field]: value }));
  }

  // function handleNextButtonClick() {
  //   // Check if the current question needs additional text input
  //   if (currentQuestion.no === 15 && answers[15]?.answer === 'Yes' && counselingReason.trim() === '') {
  //     alert('Please specify why you require counseling.');
  //     return;
  //   } else if (currentQuestion.no === 7 && answers[7]?.answer === 'State Board' && counselingReason7.trim() === '') {
  //     alert('Please specify your State Board.');
  //     return;
  //   } else if (currentQuestion.no === 8 && answers[8]?.answer === 'State Board' && counselingReason8.trim() === '') {
  //     alert('Please specify your State Board.');
  //     return;
  //   }

  //   if (currentQuestionIndex === 14 && answers[15] === 'Yes') {
  //     setCurrentQuestionIndex(15);
  //   } else if (currentQuestionIndex < DemographicQuestions.length - 1) {
  //     setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  //   } else {
  //     handleGoAhead();
  //   }
  // }
  function handleNextButtonClick() {
    // Check if the current question needs additional text input
    if (
      currentQuestion.no === 15 &&
      typeof answers[15] === "object" &&
      "answer" in answers[15] &&
      answers[15].answer === "Yes" &&
      counselingReason.trim() === ""
    ) {
      alert("Please specify why you require counseling.");
      return;
    } else if (
      currentQuestion.no === 7 &&
      typeof answers[7] === "object" &&
      "answer" in answers[7] &&
      answers[7].answer === "State Board" &&
      counselingReason7.trim() === ""
    ) {
      alert("Please specify your State Board.");
      return;
    } else if (
      currentQuestion.no === 8 &&
      typeof answers[8] === "object" &&
      "answer" in answers[8] &&
      answers[8].answer === "State Board" &&
      counselingReason8.trim() === ""
    ) {
      alert("Please specify your State Board.");
      return;
    }

    if (
      currentQuestionIndex === 14 &&
      typeof answers[15] === "object" &&
      "answer" in answers[15] &&
      answers[15].answer === "Yes"
    ) {
      setCurrentQuestionIndex(15);
    } else if (currentQuestionIndex < DemographicQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleGoAhead();
    }
  }

  function handlePreviousButtonClick() {
    if (currentQuestionIndex === 15 && answers[15] === "Yes") {
      setCurrentQuestionIndex(14);
    } else {
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }
  }

  // async function handleGoAhead() {
  //   if (!startTime) {
  //     console.error("Start time is not set.");
  //     return;
  //   }

  //   const endTime = dayjs();
  //   const elapsedTime = endTime.diff(startTime, 'seconds'); // Calculate elapsed time in seconds

  //   console.log('ELAPSED TIME ', elapsedTime);

  //   const newFileNumber = lastFileNumber + 1;
  //   const filename = `demographic_sheet_${newFileNumber}.csv`;
  //   try {
  //     const response = await fetch("/api/save-csv", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         testScores: answers,
  //         filename,
  //         moduleType: 'Demographic',
  //         timeRecords: {
  //           [`Question ${currentQuestionIndex + 1}`]: `${elapsedTime} seconds` // Ensure time is formatted correctly
  //         }
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to save demographic test");
  //     }

  //     const result = await response.json();
  //     console.log("CSV File saved successfully:", result.filename);

  //     onComplete();
  //   } catch (error) {
  //     console.error("Error saving demographic test:", error);
  //   }
  // }
  async function handleGoAhead() {
    if (!startTime) {
      console.error("Start time is not set.");
      return;
    }

    const endTime = dayjs();
    const elapsedTime = endTime.diff(startTime, "seconds");

    console.log("ELAPSED TIME ", elapsedTime);

    const newFileNumber = lastFileNumber + 1;
    const filename = `demographic_sheet_${newFileNumber}.csv`;

    const timeRecords = {
      [`Question ${currentQuestionIndex + 1}`]: `${elapsedTime} seconds`,
    };

    try {
      const response = await fetch(
        "https://woxsen-per-test-gvif4bv3a-sobitprasads-projects.vercel.app/api/save-csv",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            testScores: answers,
            filename,
            moduleType: "Demographic",
            timeRecords,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save demographic test");
      }

      const result = await response.json();
      console.log("CSV File saved successfully:", result.filename);

      onComplete(timeRecords);
    } catch (error) {
      console.error("Error saving demographic test:", error);
    }
  }

  const progress =
    ((currentQuestionIndex + 1) / DemographicQuestions.length) * 100;

  // useEffect(() => {
  //   if (dualTextAnswers.mother || dualTextAnswers.father) {
  //     setAnswers(prev => ({ ...prev, [13]: dualTextAnswers }));
  //   }
  // }, [dualTextAnswers]);

  useEffect(() => {
    if (dualTextAnswers.mother || dualTextAnswers.father) {
      setAnswers((prev) => ({
        ...prev,
        [13]: {
          mother: dualTextAnswers.mother || "",
          father: dualTextAnswers.father || "",
        },
      }));
    }
  }, [dualTextAnswers]);
  const getInputValue = () => {
    const answer = answers[currentQuestion.no];

    if (typeof answer === "string") {
      return answer; // already a string
    }

    if (answer && typeof answer === "object") {
      // For objects, you need to decide which field to use or convert to a string
      // Example: if it's { answer: string; specification: string; }
      if ("answer" in answer) {
        return answer.answer; // or some other appropriate field
      }
    }

    return ""; // Default value if none of the conditions match
  };

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
      <Progress
        value={progress}
        w="80%"
      />
      <Flex direction="column">
        <Text
          fontWeight="bold"
          align="center"
        >
          #{currentQuestionIndex + 1}/{DemographicQuestions.length}
        </Text>
        <Text
          fontSize="lg"
          align="center"
        >
          {currentQuestion.text}
        </Text>
      </Flex>
      <Flex
        w="full"
        gap={4}
        direction="column"
        {...getRootProps()}
      >
        {currentQuestion.type === "text" ? (
          <Input
            value={getInputValue()}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        ) : currentQuestion.type === "select" && currentQuestion.options ? (
          <>
            {currentQuestion.options.map((option) => {
              const radioProps = getRadioProps({ value: option });
              return (
                <TestAnswerOption
                  key={option}
                  {...radioProps}
                >
                  {option}
                </TestAnswerOption>
              );
            })}

            {currentQuestion.no === 7 &&
              ((typeof answers[7] === "string" &&
                answers[7] === "State Board") ||
                (typeof answers[7] === "object" &&
                  "answer" in answers[7] &&
                  answers[7].answer === "State Board")) && (
                <Input
                  placeholder="State Board (please specify- )"
                  value={counselingReason7}
                  onChange={(e) => handlespecify(e.target.value)}
                />
              )}

            {currentQuestion.no === 8 &&
              ((typeof answers[8] === "string" &&
                answers[8] === "State Board") ||
                (typeof answers[8] === "object" &&
                  "answer" in answers[8] &&
                  answers[8].answer === "State Board")) && (
                <Input
                  placeholder="State Board (please specify- )"
                  value={counselingReason8}
                  onChange={(e) =>
                    handleHighersecondaryeducation(e.target.value)
                  }
                />
              )}

            {currentQuestion.no === 15 &&
              ((typeof answers[15] === "string" && answers[15] === "Yes") ||
                (typeof answers[15] === "object" &&
                  "answer" in answers[15] &&
                  answers[15].answer === "Yes")) && (
                <Input
                  placeholder="If yes, please specify why"
                  value={counselingReason}
                  onChange={(e) => handleCounselingReasonChange(e.target.value)}
                />
              )}
          </>
        ) : currentQuestion.type === "dual-text" ? (
          <Flex
            direction="column"
            gap={4}
          >
            <Input
              placeholder="Mother's Education Level"
              value={dualTextAnswers.mother || ""}
              onChange={(e) => handleDualTextChange("mother", e.target.value)}
            />
            <Input
              placeholder="Father's Education Level"
              value={dualTextAnswers.father || ""}
              onChange={(e) => handleDualTextChange("father", e.target.value)}
            />
          </Flex>
        ) : null}
      </Flex>
      <Flex
        direction="row"
        w="full"
        gap={4}
      >
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
          {currentQuestionIndex === DemographicQuestions.length - 1
            ? "Submit"
            : "Next"}
        </Button>
      </Flex>
    </Flex>
  );
}
