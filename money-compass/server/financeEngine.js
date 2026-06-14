const round2 = (n) => Math.round(n * 100) / 100;
const pct = (part, whole) => (whole === 0 ? 0 : round2((part / whole) * 100));

const CATEGORY_BUCKETS = {
  rent: 'needs', utilities: 'needs', groceries: 'needs', insurance: 'needs',
  transport: 'needs', minDebtPayments: 'needs',
  subscriptions: 'wants', dining: 'wants', entertainment: 'wants', shopping: 'wants', other: 'wants',
  savings: 'savingsDebt', extraDebtPayments: 'savingsDebt',
};

function analyzeFinances(input) {
  const { income = 0, expenses = {}, totalDebt = 0, emergencyFund = 0 } = input;

  const totalExpenses = round2(Object.values(expenses).reduce((a, b) => a + (Number(b) || 0), 0));
  const cashFlow = round2(income - totalExpenses);
  const savingsRate = pct(Math.max(cashFlow, 0), income);

  const buckets = { needs: 0, wants: 0, savingsDebt: 0 };
  for (const [cat, amount] of Object.entries(expenses)) {
    const bucket = CATEGORY_BUCKETS[cat] || 'wants';
    buckets[bucket] += Number(amount) || 0;
  }
  if (cashFlow > 0) buckets.savingsDebt += cashFlow;

  const bucketPct = {
    needs: pct(buckets.needs, income),
    wants: pct(buckets.wants, income),
    savingsDebt: pct(buckets.savingsDebt, income),
  };

  const monthlyEssentials = buckets.needs || 1;
  const runwayMonths = round2(emergencyFund / monthlyEssentials);

  const minDebtPayment = Number(expenses.minDebtPayments) || 0;
  const dti = pct(minDebtPayment, income);

  const scoreSavings = Math.min(savingsRate / 20, 1) * 30;
  const scoreRunway = Math.min(runwayMonths / 6, 1) * 25;
  const scoreDTI = Math.max(0, 1 - dti / 36) * 25;
  const scoreBalance =
    (1 - Math.min(Math.abs(bucketPct.needs - 50) / 50, 1)) * 10 +
    (1 - Math.min(Math.abs(bucketPct.wants - 30) / 30, 1)) * 10;

  const score = Math.round(scoreSavings + scoreRunway + scoreDTI + scoreBalance);

  return {
    summary: {
      income: round2(income), totalExpenses, cashFlow, savingsRate,
      runwayMonths, dti, totalDebt: round2(totalDebt), emergencyFund: round2(emergencyFund),
    },
    rule503020: {
      actual: bucketPct,
      target: { needs: 50, wants: 30, savingsDebt: 20 },
    },
    score,
    insights: buildInsights({ savingsRate, runwayMonths, dti, bucketPct, cashFlow }),
    lessons: buildLessons({ savingsRate, runwayMonths, dti, bucketPct, cashFlow }),
  };
}

function buildInsights({ savingsRate, runwayMonths, dti, bucketPct, cashFlow }) {
  const insights = [];

  if (cashFlow < 0) {
    insights.push({
      level: 'danger',
      title: 'You are spending more than you earn',
      detail: `Your expenses exceed income by $${Math.abs(cashFlow).toFixed(2)} this month. This is the single most urgent thing to fix — every other goal depends on a positive cash flow.`,
    });
  } else if (savingsRate < 10) {
    insights.push({
      level: 'warning',
      title: 'Savings rate is below a healthy minimum',
      detail: `You're saving about ${savingsRate}% of income. Many planners suggest aiming for at least 15-20%. Even an extra 1-2% moved automatically each month compounds significantly over years.`,
    });
  } else if (savingsRate >= 20) {
    insights.push({
      level: 'good',
      title: 'Strong savings rate',
      detail: `You're saving roughly ${savingsRate}% of income, which meets or exceeds the commonly recommended 20% target. Consider directing part of this toward tax-advantaged investing if you aren't already.`,
    });
  }

  if (runwayMonths < 1) {
    insights.push({
      level: 'danger',
      title: 'No real emergency buffer',
      detail: `Your emergency fund covers less than one month of essential expenses. A single unexpected bill (car repair, medical cost) could force you into debt. Building even a $500-1000 starter fund is the highest-leverage first step.`,
    });
  } else if (runwayMonths < 3) {
    insights.push({
      level: 'warning',
      title: 'Emergency fund below 3 months',
      detail: `You currently have about ${runwayMonths} months of essential expenses saved. The standard guidance is 3-6 months. You're partway there — keep building.`,
    });
  } else if (runwayMonths >= 6) {
    insights.push({
      level: 'good',
      title: 'Emergency fund is solid',
      detail: `At ${runwayMonths} months of essential expenses, your buffer meets typical recommendations (3-6 months). Funds beyond ~6 months could often work harder in an investment account.`,
    });
  }

  if (dti > 36) {
    insights.push({
      level: 'warning',
      title: 'Debt payments are a large share of income',
      detail: `Minimum debt payments are about ${dti}% of income. Lenders often view above 36% as a sign of being stretched thin. Prioritizing high-interest debt payoff will free up future cash flow.`,
    });
  }

  if (bucketPct.wants > 35) {
    insights.push({
      level: 'info',
      title: '"Wants" spending is on the higher side',
      detail: `Discretionary spending is about ${bucketPct.wants}% of income, versus a common 30% guideline. This isn't necessarily bad — it's a lever you control if you ever need to free up money for savings or debt.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      level: 'good',
      title: 'Your finances look broadly balanced',
      detail: `No major red flags based on the numbers entered. Keep monitoring as income or expenses change.`,
    });
  }

  return insights;
}

function buildLessons({ savingsRate, runwayMonths, dti, bucketPct, cashFlow }) {
  return [
    {
      topic: 'Cash flow',
      explanation: 'Cash flow is simply income minus expenses. A positive number means you have money left to save, invest, or pay down debt. A negative number means debt (credit cards, loans) is quietly growing to cover the gap.',
      yourNumber: cashFlow >= 0
        ? `You have $${cashFlow.toFixed(2)} left over this month.`
        : `You're short by $${Math.abs(cashFlow).toFixed(2)} this month.`,
    },
    {
      topic: 'Savings rate',
      explanation: 'Savings rate is the percentage of income you keep rather than spend. It matters more than the absolute amount you earn, because it directly determines how fast you build wealth and how much risk you can tolerate.',
      yourNumber: `Your savings rate is ${savingsRate}%.`,
    },
    {
      topic: 'The 50/30/20 rule',
      explanation: "A simple budgeting framework: roughly 50% of income to needs (housing, utilities, groceries, minimum debt payments), 30% to wants (entertainment, dining out, subscriptions), and 20% to savings and extra debt payoff. It's a starting point, not a law — high cost-of-living areas often need a higher 'needs' share.",
      yourNumber: `Your split is ${bucketPct.needs}% needs / ${bucketPct.wants}% wants / ${bucketPct.savingsDebt}% savings & debt.`,
    },
    {
      topic: 'Emergency fund',
      explanation: 'An emergency fund is cash set aside (usually in a high-yield savings account) to cover essential expenses if income stops or a large unplanned cost hits. It prevents short-term shocks from turning into long-term debt.',
      yourNumber: `Your fund covers about ${runwayMonths} months of essential expenses.`,
    },
    {
      topic: 'Debt-to-income ratio (DTI)',
      explanation: "DTI compares your monthly debt payments to your income. Lenders use it to gauge how much of your paycheck is already committed before you even start spending. Lower is more flexible; very high DTI limits your options in an emergency.",
      yourNumber: `Your DTI from minimum debt payments is ${dti}%.`,
    },
  ];
}

module.exports = { analyzeFinances };