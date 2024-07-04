import create from "zustand";

import { TestAnswerOption } from "../lib/personality-test";

interface UserTestAnswersState {
  userTestAnswers: TestAnswerOption["score"][]; // Storing scores as numbers
  setUserTestAnswers: (newUserTestAnswers: TestAnswerOption["score"][]) => void; // Updating with scores as numbers
}

const useUserTestAnswersStore = create<UserTestAnswersState>((set) => ({
  userTestAnswers: [],
  setUserTestAnswers: (newUserTestAnswers) =>
    set(() => ({
      userTestAnswers: newUserTestAnswers,
    })),
}));

export default useUserTestAnswersStore;
