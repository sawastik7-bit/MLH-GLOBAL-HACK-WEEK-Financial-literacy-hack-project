# Money Compass




<img width="1866" height="902" alt="Screenshot 2026-06-14 103648" src="https://github.com/user-attachments/assets/b4919b9a-4449-49e2-aca7-7b41a6a024a9" />



A backend-driven personal finance literacy tool built for MLH Global Hack Week.

## What it does
- **Budget Check**: Enter your monthly income and expenses. Get a financial health score (0-100), cash flow, savings rate, emergency fund runway, debt-to-income ratio, and a 50/30/20 rule breakdown — plus plain-English insights and lessons tied to *your* actual numbers.
- **Glossary**: Searchable definitions of core finance terms (compound interest, DTI, diversification, etc.).
- **Quiz**: Short knowledge check with explanations for each answer.

## Stack
- Node.js + Express backend (with a simple in-memory token-bucket rate limiter)
- Vanilla HTML/CSS/JS frontend, no build step required

## Run it
\`\`\`bash
npm install
npm start
\`\`\`
Visit http://localhost:3000

## API
- `GET /api/health`
- `POST /api/analyze` — body: `{ income, expenses: {...}, totalDebt, emergencyFund }`
- `GET /api/glossary` or `/api/glossary?term=...`
- `GET /api/quiz`
- `POST /api/quiz/grade` — body: `{ answers: { q1: 0, q2: 2, ... } }`
