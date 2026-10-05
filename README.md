# TalentPulse

TalentPulse is an interview preparation and resume evaluation platform. It helps job seekers practice technical and behavioral interviews in an interactive environment, receive targeted feedback on their answers, analyze their resumes for ATS compatibility, and track preparation progress over time.

---

## Features

### 1. Interactive Mock Interviews
* **Role-Specific Sessions**: Practice either technical or behavioral interviews tailored to your target job title.
* **Audio & Video Interviewer**: Browser-based speech synthesis dictates questions naturally, paired with interviewer personas.
* **Voice Answering & Live Coding**: Answer questions verbally using speech-to-text recognition or write code directly inside an integrated Monaco code editor.
* **Instant Answer Feedback**: Receive specific evaluation, strengths, and areas to improve immediately after submitting each answer.
* **Detailed Performance Reports**: Access a full breakdown of scores, answers, and improvement suggestions for completed interviews.
* **Interview History**: Track scores and review previous practice sessions from the dashboard.

### 2. Resume Scoring & ATS Analysis
* **ATS Compatibility Score**: Upload a PDF resume to receive a score from 0 to 100 based on standard industry screening criteria.
* **Strengths & Weaknesses**: Clear breakdown of what stands out and what needs improvement in your resume.
* **Missing Skills & Role Suggestions**: Identifies skill gaps for target roles and recommends the most suitable job profiles based on your experience.
* **Resume Builder**: Build, manage, and download formatted resumes.

### 3. Credit System & Billing
* **Practice Credits**: Actions such as scoring a resume or running an interview session deduct credits from your account balance.
* **Credit Packs**: Purchase additional practice packs securely through the integrated Razorpay checkout.

### 4. Authentication & Security
* **Google Sign-In**: Quick authentication using Google via Firebase.
* **Session Management**: Server-side cookie sessions powered by Redis for fast validation across services.
* **API Gateway Routing**: Single gateway managing authentication, route forwarding, and header injection to internal microservices.

---

## APIs & External Services Used

| Service | Purpose |
| :--- | :--- |
| **Groq API** | Powers resume parsing, question generation, and answer evaluation using high-speed model inference. |
| **Firebase Auth & Admin SDK** | Manages Google login and verifies user identity tokens. |
| **Razorpay API** | Processes orders and verifies payment signatures for credit purchases. |
| **MongoDB Atlas** | Stores user accounts, resumes, interview sessions, and billing transactions. |
| **Redis** | Manages authenticated sessions and fast caching for resumes and interview history. |
| **Web Speech API** | In-browser speech recognition (voice input) and speech synthesis (voice questions). |

---

## System Architecture

The project is structured as a microservices architecture coordinated by an API Gateway:

```
TalentPulse/
├── backend/
│   ├── gateway/                 # Express API Gateway (port 9999)
│   ├── caching/redis/           # Shared Redis client configuration
│   └── services/
│       ├── authService/         # Google auth, user accounts, and credits (port 8888)
│       ├── resumeService/       # PDF parsing, ATS scoring (port 7777)
│       ├── interviewService/    # Interview generation, feedback (port 6666)
│       └── billingService/      # Razorpay payment orders & verification (port 5555)
├── frontend/                    # Vite + React 19 + Tailwind CSS + Motion
└── vercel.json                  # Multi-service deployment and route rewrites
```

---

## Prerequisites

Make sure you have the following installed and set up before running locally:

* **Node.js** (v18.0 or higher)
* **npm** (or yarn / pnpm)
* **MongoDB Atlas** cluster (or local MongoDB)
* **Redis** server (local or a managed instance like Upstash, Aiven, or Redis Cloud)
* Accounts / credentials for:
  * **Groq Cloud** (API key)
  * **Firebase Console** (Web App config + Service Account credentials)
  * **Razorpay Dashboard** (Key ID & Key Secret)

---

## Environment Variables

### Redis (Shared Cache & Session Store)
Shared across services via their local `configs/redisConfig.js`:
```env
REDIS_HOST="your-redis-host"
REDIS_PORT=6379
REDIS_USERNAME="default"
REDIS_PASSWORD="your-redis-password"
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:9999"
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_RAZORPAY_KEY_ID="your-razorpay-key-id"
```

### Gateway (`backend/gateway/.env`)
```env
PORT=9999
URL_AUTH="http://localhost:8888"
URL_RESUME="http://localhost:7777"
URL_INTERVIEW="http://localhost:6666"
URL_BILLING="http://localhost:5555"
URL_FRONTEND="http://localhost:5173"
```

### Auth Service (`backend/services/authService/.env`)
```env
PORT=8888
AUTH_MONGODB_URI="mongodb+srv://.../auth"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
```

### Resume Service (`backend/services/resumeService/.env`)
```env
PORT=7777
RESUME_MONGODB_URI="mongodb+srv://.../resume"
RESUME_GROQ_API_KEY="your-groq-api-key"
```

### Interview Service (`backend/services/interviewService/.env`)
```env
PORT=6666
INTERVIEW_MONGODB_URI="mongodb+srv://.../interview"
INTERVIEW_GROQ_API_KEY="your-groq-api-key"
```

### Billing Service (`backend/services/billingService/.env`)
```env
PORT=5555
BILLING_MONGODB_URI="mongodb+srv://.../billing"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

---

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TalentPulse.git
cd TalentPulse
```

### 2. Install dependencies
Run `npm install` inside the frontend and each backend service:

```bash
# Frontend
cd frontend && npm install && cd ..

# Gateway
cd backend/gateway && npm install && cd ../..

# Services
cd backend/services/authService && npm install && cd ../../..
cd backend/services/resumeService && npm install && cd ../../..
cd backend/services/interviewService && npm install && cd ../../..
cd backend/services/billingService && npm install && cd ../../..
```

### 3. Start Redis
Make sure your Redis server is running locally on port `6379`, or configure the remote connection credentials (`REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`) in your environment.

### 4. Start the backend services
Run each service in a separate terminal:

```bash
# Gateway
cd backend/gateway && npm run dev

# Auth Service
cd backend/services/authService && npm run dev

# Resume Service
cd backend/services/resumeService && npm run dev

# Interview Service
cd backend/services/interviewService && npm run dev

# Billing Service
cd backend/services/billingService && npm run dev
```

### 5. Start the frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Deployment (Vercel)

The repository includes a configured [`vercel.json`](./vercel.json) that defines the microservice architecture for Vercel:

* `frontend` is built as a Vite application.
* `gateway`, `authservice`, `resumeservice`, `interviewservice`, and `billingservice` are built as individual Express services.
* Incoming requests to `/api/*` route to `gateway`, while all other paths route to `frontend`.
* Service URLs (`URL_AUTH`, `URL_RESUME`, `URL_INTERVIEW`, `URL_BILLING`) are automatically bound by Vercel.
* Add your project-wide environment variables in your Vercel Project Settings:
  * **Databases**: `AUTH_MONGODB_URI`, `RESUME_MONGODB_URI`, `INTERVIEW_MONGODB_URI`, `BILLING_MONGODB_URI`
  * **Redis**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`
  * **AI Models**: `RESUME_GROQ_API_KEY`, `INTERVIEW_GROQ_API_KEY`
  * **Firebase**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  * **Payments**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  * **App URL**: `URL_FRONTEND`
