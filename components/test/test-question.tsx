// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import { useRadioGroup, Flex, Text, Button, useToast } from "@chakra-ui/react";

// import TestProgress from "./test-progress";
// import TestAnswerOption from "./test-answer-option";
// import { CsvData } from "../../lib/types";
// import { personalityTest } from "../../data/personality-test";
// import { getQuestionAnswerScore } from "../../lib/personality-test";
// import useUserTestAnswersStore from "../../store/use-user-test-answers";

// export default function TestQuestion() {
//   const router = useRouter();
//   const toast = useToast();
//   const { userTestAnswers, setUserTestAnswers } = useUserTestAnswersStore();
//   const [currentPersonalityTestIndex, setCurrentPersonalityTestIndex] = useState(0);
//   const [isAttentivenessCheckPassed, setIsAttentivenessCheckPassed] = useState(true);

//   const isUserAlreadyPickAnswer = userTestAnswers[currentPersonalityTestIndex] !== undefined;

//   const { getRootProps, getRadioProps, setValue } = useRadioGroup({
//     name: "answer",
//     defaultValue: String(userTestAnswers[currentPersonalityTestIndex] || ""),
//     onChange: (value) => handleAnswerChange(value),
//   });

//   useEffect(() => {
//     setValue(String(userTestAnswers[currentPersonalityTestIndex] || ""));
//   }, [currentPersonalityTestIndex, userTestAnswers, setValue]);

//   const attentivenessChecks = {
//     6: "Strongly Agree",
//     15: "Neutral",
//     26: "Strongly Disagree",
//     38: "Agree",
//     50: "Disagree",
//     61: "Neutral"
//   };

//   function handleAnswerChange(value: string) {
//     const newUserTestAnswers = [...userTestAnswers];
//     newUserTestAnswers[currentPersonalityTestIndex] = value;
//     setUserTestAnswers(newUserTestAnswers);

//     const currentQuestionNumber = currentPersonalityTestIndex + 1;
//     if (currentQuestionNumber in attentivenessChecks) {
//       if (value !== attentivenessChecks[currentQuestionNumber as keyof typeof attentivenessChecks]) {
//         setIsAttentivenessCheckPassed(false);
//         toast({
//           title: "Attention Check",
//           description: "Please select the right option as instructed in the question.",
//           status: "warning",
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         setIsAttentivenessCheckPassed(true);
//       }
//     }
//   }

//   async function handleSubmitButtonClick() {
//     const timestamp = Date.now();
//     const attentivenessCheckQuestions = [6, 15, 26, 38, 50, 61];

//     const testScores: CsvData[] = userTestAnswers
//       .filter((_, index) => !attentivenessCheckQuestions.includes(index + 1))
//       .map((answer, index) => {
//         let parsedAnswer: string = String(answer);
    
//         const adjustedQuestionNumber = index + 1 + attentivenessCheckQuestions.filter(q => q <= index + 1).length;
    
//         const score = getQuestionAnswerScore(adjustedQuestionNumber, parsedAnswer);
    
//         if (score === undefined) {
//           throw new Error(`Score undefined for answer at index ${index}`);
//         }
    
//         return {
//           sNo: adjustedQuestionNumber,
//           statement: personalityTest[adjustedQuestionNumber - 1]?.question || "",
//           score: score,
//         };
//       });

//     const filename = `test_result_${timestamp}.csv`;
//     const folderPath = "csv files";

//     try {
//       const response = await fetch('/api/save-csv', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ testScores, filename }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save CSV file');
//       }

      

//       setUserTestAnswers([]); // Clear user answers after submission
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description: `Failed to save results: ${error.message}`,
//       status: "error",
//       duration: 5000,
//       isClosable: true,
//     });
//   }
// }

//   function handleNextButtonClick() {
//     if (currentPersonalityTestIndex + 1 in attentivenessChecks && !isAttentivenessCheckPassed) {
//       toast({
//         title: "Attention Check",
//         description: "Please select the correct option before proceeding.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     setCurrentPersonalityTestIndex((prevIndex) =>
//       prevIndex < personalityTest.length - 1 ? prevIndex + 1 : prevIndex
//     );
//     setIsAttentivenessCheckPassed(true);
//   }

//   function handlePreviousButtonClick() {
//     setCurrentPersonalityTestIndex((prevIndex) =>
//       prevIndex > 0 ? prevIndex - 1 : prevIndex
//     );
//     setIsAttentivenessCheckPassed(true);
//   }

//   return (
//     <Flex
//       py={4}
//       w="full"
//       h="full"
//       gap={8}
//       direction="column"
//       justifyContent="space-between"
//       alignItems="center"
//     >
//       <TestProgress />
//       <Flex direction="column">
//         <Text fontWeight="bold" align="center">
//           #{currentPersonalityTestIndex + 1}
//         </Text>
//         <Text fontSize="lg" align="center">
//           {personalityTest[currentPersonalityTestIndex]?.question}
//         </Text>
//       </Flex>
//       <Flex w="full" gap={4} direction="column" {...getRootProps()}>
//         {personalityTest[currentPersonalityTestIndex]?.answerOptions.map(
//           (answerOption) => {
//             const radioProps = getRadioProps({ value: answerOption.answer });
//             return (
//               <TestAnswerOption key={answerOption.answer} {...radioProps}>
//                 {answerOption.answer}
//               </TestAnswerOption>
//             );
//           }
//         )}
//       </Flex>
//       <Flex direction="row" w="full" gap={4}>
//         <Button
//           w="full"
//           variant="outline"
//           disabled={currentPersonalityTestIndex === 0}
//           onClick={handlePreviousButtonClick}
//         >
//           Previous
//         </Button>
//         {isUserAlreadyPickAnswer &&
//         currentPersonalityTestIndex === personalityTest.length - 1 ? (
//           <Button
//             w="full"
//             colorScheme="primary"
//             onClick={handleSubmitButtonClick}
//           >
//             Submit
//           </Button>
//         ) : (
//           <Button
//             w="full"
//             colorScheme="primary"
//             variant="outline"
//             disabled={!isUserAlreadyPickAnswer || !isAttentivenessCheckPassed}
//             onClick={handleNextButtonClick}
//           >
//             Next
//           </Button>
//         )}
//       </Flex>
//     </Flex>
//   );
// }