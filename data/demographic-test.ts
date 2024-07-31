interface Question {
    no: number;
    text: string;
    type: 'text' | 'select' | 'dual-text';
    options?: string[];
  }

export const DemographicQuestions: Question[] = [
    { no: 1, text: 'Age:', type: 'text' },
    { no: 2, text: 'Country:', type: 'text' },
    { no: 3, text: 'Residing State:', type: 'text' },
    { no: 4, text: 'Gender:', type: 'select', options: ['Male', 'Female', 'Transgender', 'Non-Binary', 'Prefer not to respond'] },
    { no: 5, text: 'If English is not your first language, how would you rate your ability to understand English?', type: 'select', options: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Fluent'] },
    { no: 6, text: 'Highest level of Education?', type: 'select', options: ['Higher Secondary', 'Pursuing Bachelor’s', 'Undergraduate', 'Pursuing Master’s'] },
    { no: 7, text: 'Which Secondary education board did you follow?', type: 'select', options: ['CBSE', 'ICSE', 'IGCSE', 'State Board'] },
    { no: 8, text: 'Which Higher Secondary education board did you follow?', type: 'select', options: ['CBSE', 'ICSE', 'IGCSE', 'State Board'] },
    { no: 9, text: 'What is your Birth Order?', type: 'select', options: ['Oldest Child', 'Middle Child', 'Youngest Child', 'Only Child'] },
    { no: 10, text: 'How many siblings do you have?', type: 'text' },
    { no: 11, text: 'How would you categorize your socio-economic background?', type: 'select', options: ['Below 2 Lakhs (per annum)', '2 lakhs- 5 lakhs (per annum)', '5 lakhs-10 lakhs (per annum)', '10 lakhs-20 lakhs (per annum)', 'above 20 lakhs (per annum)'] },
    { no: 12, text: 'How would you describe your family structure?', type: 'select', options: ['Nuclear', 'Joint', 'Single-Parent'] },
    { no: 13, text: 'Highest level of education completed by your parents (both mother and father)?', type: 'dual-text' },
    { no: 14, text: 'Did your family move often when you were growing up?', type: 'select', options: ['Yes, very often', 'Yes, occasionally', 'No, we lived in the same place throughout my childhood'] },
    { no: 15, text: 'Have you ever received counseling in the past?', type: 'select', options: ['Yes', 'No'] },
    { no: 16, text: 'Do you have a history of medical illness or physical injuries?', type: 'text' },
  ];