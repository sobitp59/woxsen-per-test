// store/use-user-test-answers.ts

import create from "zustand";

export interface UserTestAnswersState {
  userTestAnswers: string[]; // Store answers as strings
  setUserTestAnswers: (newUserTestAnswers: string[]) => void; // Update with answers as strings
}

const useUserTestAnswersStore = create<UserTestAnswersState>((set) => ({
  userTestAnswers: [],
  setUserTestAnswers: (newUserTestAnswers) =>
    set(() => ({
      userTestAnswers: newUserTestAnswers,
    })),
}));

export default useUserTestAnswersStore;
