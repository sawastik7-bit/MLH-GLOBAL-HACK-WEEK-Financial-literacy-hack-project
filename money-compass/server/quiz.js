const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What does a positive "cash flow" mean?',
    options: [
      'You earn more than you spend',
      'You spend more than you earn',
      'Your credit score went up',
      'You have no debt at all',
    ],
    correctIndex: 0,
    explanation: 'Positive cash flow = income minus expenses is greater than zero, meaning money is left over to save or invest.',
  },
  {
    id: 'q2',
    question: 'In the 50/30/20 rule, what does the "20" represent?',
    options: [
      '20% interest rate on savings',
      '20% of income for needs',
      '20% of income for savings and extra debt payoff',
      '20% tax bracket',
    ],
    correctIndex: 2,
    explanation: 'The 50/30/20 rule allocates roughly 20% of income toward savings and paying down debt beyond minimums.',
  },
  {
    id: 'q3',
    question: 'Why is an emergency fund important?',
    options: [
      'It earns the highest possible investment returns',
      'It covers essential expenses if income stops or a surprise cost hits',
      'It is required to get a credit card',
      'It increases your debt-to-income ratio',
    ],
    correctIndex: 1,
    explanation: 'An emergency fund acts as a buffer against unexpected expenses or income loss, preventing reliance on debt.',
  },
  {
    id: 'q4',
    question: 'A high debt-to-income (DTI) ratio generally means:',
    options: [
      'You have excellent credit',
      'A large share of your income is already committed to debt payments',
      'You have a large emergency fund',
      'Your savings rate is high',
    ],
    correctIndex: 1,
    explanation: 'High DTI means more of your income is tied up in debt payments, leaving less flexibility for savings or emergencies.',
  },
  {
    id: 'q5',
    question: 'What is compound interest?',
    options: [
      'Interest charged only once at the start of a loan',
      'Interest calculated only on the original principal',
      'Interest calculated on both principal and previously earned interest',
      'A fee banks charge for opening an account',
    ],
    correctIndex: 2,
    explanation: 'Compound interest grows on top of both the principal and any interest already accumulated, accelerating growth over time.',
  },
  {
    id: 'q6',
    question: 'Which of these is typically considered a "need" rather than a "want"?',
    options: [
      'Streaming subscriptions',
      'Rent or mortgage payment',
      'Dining out',
      'Concert tickets',
    ],
    correctIndex: 1,
    explanation: 'Housing costs are essential and fall under "needs" in budgeting frameworks like the 50/30/20 rule.',
  },
  {
    id: 'q7',
    question: 'Diversification in investing primarily helps to:',
    options: [
      'Guarantee profits',
      'Eliminate all risk',
      'Reduce the impact of any single investment performing poorly',
      'Avoid paying taxes',
    ],
    correctIndex: 2,
    explanation: 'Diversification spreads risk across different assets so one poor performer has less impact on the overall portfolio.',
  },
];

module.exports = { QUIZ_QUESTIONS };