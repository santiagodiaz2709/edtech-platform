# EdTech Platform Backend

This is the backend server for the SAT/ACT preparation platform. It provides APIs for user authentication, test generation, and subscription management.

## Features

- User authentication with JWT
- Personalized test generation based on user interests
- Diagnostic test tracking
- Practice history
- Stripe integration for subscription management
- MongoDB database integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=https://snazzy-quokka-48627f.netlify.app
```

3. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication

#### Register User
- **POST** `/auth/register`
- Body: `{ email, password, name }`
- Returns: User object with JWT token

#### Login User
- **POST** `/auth/login`
- Body: `{ email, password }`
- Returns: User object with JWT token

#### Get Current User
- **GET** `/auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: User object

#### Update User Interests
- **PATCH** `/auth/me/interests`
- Headers: `Authorization: Bearer <token>`
- Body: `{ interests: string[] }`
- Returns: Updated interests array

### Tests

#### Generate Practice Test
- **POST** `/api/tests/generate`
- Headers: `Authorization: Bearer <token>`
- Body: `{ testType: "SAT" | "ACT" }`
- Returns: Generated test object

#### Submit Diagnostic Test
- **POST** `/api/tests/diagnostic`
- Headers: `Authorization: Bearer <token>`
- Body: `{ testType, sections, totalScore }`
- Returns: Saved diagnostic result

#### Get Practice History
- **GET** `/api/tests/history`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of practice sessions

#### Get Diagnostic Results
- **GET** `/api/tests/diagnostic`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of diagnostic results

### Subscriptions

#### Create Subscription
- **POST** `/api/subscriptions/create`
- Headers: `Authorization: Bearer <token>`
- Body: `{ paymentMethodId, planType }`
- Returns: Stripe subscription details

#### Cancel Subscription
- **POST** `/api/subscriptions/cancel`
- Headers: `Authorization: Bearer <token>`
- Returns: Cancellation confirmation

## Models

### User
- email (String, required, unique)
- password (String, required)
- name (String, required)
- interests (Array of Strings)
- subscription (Object)
  - status: 'active' | 'inactive' | 'cancelled'
  - plan: 'monthly' | 'yearly' | 'none'
  - stripeCustomerId (String)
  - stripeSubscriptionId (String)

### Diagnostic
- user (ObjectId, ref: 'User')
- testType: 'SAT' | 'ACT'
- sections (Array)
  - name (String)
  - score (Number)
  - totalQuestions (Number)
  - correctAnswers (Number)
  - topics (Array)
    - name (String)
    - performance: 'weak' | 'moderate' | 'strong'
- totalScore (Number)

### Practice
- user (ObjectId, ref: 'User')
- testType: 'SAT' | 'ACT'
- questions (Array)
  - question (String)
  - answer (String)
  - userAnswer (String)
  - isCorrect (Boolean)
  - topic (String)
  - difficulty: 'easy' | 'medium' | 'hard'
  - relatedInterest (String)
- score (Number)
- timeSpent (Number) 
