# ClariX AI 🤖

> An AI-powered SaaS platform with subscription tiers, multiple AI tools, usage tracking, and Stripe integration — built with microservices architecture using PostgreSQL (Supabase) and Prisma ORM.

![ClariX AI](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800)

## 🌐 Live Demo

- **Frontend:** https://clarixai.vercel.app (coming soon)
- **API Gateway:** https://clarixai-api.onrender.com (coming soon)
- **AI Microservice:** https://clarixai-ai.onrender.com (coming soon)

> ⚠️ Note: Services are hosted on Render free tier — first request may take 30-60 seconds to wake up.

---

## ✨ Features

### Authentication & Billing

- 🔐 **JWT Authentication** — Secure login/register with refresh tokens
- 💳 **Stripe Subscription** — Monthly plan with automatic billing
- 🆓 **Free Tier** — 5 AI requests per day for trial users
- 👑 **Paid Tier** — Unlimited AI requests + priority processing
- 📊 **Usage Tracking** — Per-user request counting stored in PostgreSQL
- 📈 **Analytics Dashboard** — Visualize your usage over time

### AI Tools Suite

- 📄 **Resume Analyzer** — Upload CV + job description, AI scores and suggests improvements
- ✍️ **Cover Letter Generator** — Create tailored cover letters from your resume
- 🎯 **Interview Question Generator** — Get role-specific practice questions
- 📝 **Content Rewriter** — Rephrase blog posts, tweets, and emails
- 💻 **Code Explainer** — Paste any code, AI explains it line by line

### Developer Features

- 🔑 **API Key Generation** — For developers to integrate ClariX AI into their apps
- 📜 **Request History** — Complete log of all AI requests made
- 🌙 **Dark/Light Mode** — Toggle between themes

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend (Node.js Gateway)

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### AI Microservice (Python)

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-FF6B35?style=for-the-badge)

### Payments & Deployment

![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🏗️ Architecture

```
┌─────────────────┐
│ Frontend │
│ (React SPA) │
└────────┬────────┘
│ HTTP / WebSocket
┌────────▼────────┐
│ API Gateway │
│ (Node.js) │
└───┬──────┬──────┘
│ │
HTTP/gRPC │ │ Prisma
│ │
┌───────────▼──────▼───────┐
│ │
│ AI Microservice │◄────── PostgreSQL
│ (Python/Flask) │ (Supabase)
│ │
└───────────┬──────────────┘
│
│ Groq API
▼
┌─────────────┐
│ Groq Llama │
│ 3 │
└─────────────┘

```

---

## 📂 Project Structure

```
ClariX-AI/
├── api-gateway/ # Node.js + Express
│ ├── middleware/
│ │ ├── authMiddleware.js # JWT verification
│ │ └── rateLimiter.js # Free tier rate limiting
│ ├── routes/
│ │ ├── authRoutes.js # Login/register
│ │ ├── userRoutes.js # Profile, API keys
│ │ ├── subscriptionRoutes.js # Stripe webhooks
│ │ └── aiRoutes.js # Proxy to AI service
│ ├── prisma/
│ │ └── schema.prisma # PostgreSQL schema
│ └── server.js
│
├── ai-service/ # Python + Flask
│ ├── services/
│ │ ├── resume_analyzer.py # Resume vs JD analysis
│ │ ├── cover_letter.py # Cover letter generation
│ │ ├── interview_questions.py # Question generator
│ │ ├── content_rewriter.py # Paraphrasing
│ │ └── code_explainer.py # Code explanation
│ ├── app.py # Flask entry point
│ └── requirements.txt
│
└── frontend/
└── src/
├── components/
│ ├── Navbar.tsx
│ ├── UsageChart.tsx # Analytics visualization
│ ├── SubscriptionCard.tsx # Stripe pricing
│ └── APIDocs.tsx # Developer documentation
├── pages/
│ ├── Dashboard.tsx # AI tool selector
│ ├── ResumeAnalyzer.tsx
│ ├── CoverLetter.tsx
│ ├── InterviewQn.tsx
│ ├── ContentRewriter.tsx
│ ├── CodeExplainer.tsx
│ ├── PricingPage.tsx # Subscription plans
│ └── SettingsPage.tsx # API keys, theme
└── App.tsx

```

⚙️ Local Setup
Prerequisites
Node.js v18+

Python 3.9+

PostgreSQL (or Supabase account)

Redis

Stripe account (test mode)

Groq API key (free at console.groq.com)

Backend (API Gateway) Setup

cd api-gateway
npm install

# Create .env file

DATABASE_URL="postgresql://user:pass@localhost:5432/clarix"
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxx
GROQ_API_KEY=your_groq_api_key
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:5001

# Run Prisma migrations

npx prisma migrate dev --name init
npx prisma generate

npm run dev

AI Microservice (Python) Setup

cd ai-service
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env file

GROQ_API_KEY=your_groq_api_key
PORT=5001

python app.py

Frontend Setup

cd frontend
npm install

# Create .env file

VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

npm run dev

Docker Setup (Production)

docker-compose up --build

🚀 Deployment
Service Platform URL
Frontend Vercel https://clarixai.vercel.app
API Gateway Render https://clarixai-api.onrender.com
AI Microservice Render https://clarixai-ai.onrender.com
Database Supabase (PgSQL) Cloud hosted
Redis Upstash Cloud hosted

💳 Stripe Integration
Tier Price Requests
Free $0/month 5/day
Premium $9/month Unlimited
Webhook Events Handled:

checkout.session.completed — Activate premium tier

customer.subscription.deleted — Downgrade to free tier

invoice.payment_succeeded — Update subscription status

Test with Stripe CLI:
stripe listen --forward-to localhost:5000/api/sub/webhook

🤖 AI Tools
Tool Input Output
Resume Analyzer CV + Job Description Match score, missing keywords, suggestions
Cover Letter Resume + Job + Company Professional cover letter
Interview Q&A Job Title + Level 10 technical + behavioral questions
Content Rewriter Text + Tone Rewritten content
Code Explainer Code snippet Line-by-line explanation

📊 Rate Limiting
Tier Daily Limit Per Minute
Free 5 requests 1 request
Premium Unlimited 30 requests

🔮 Future Improvements

Team/organization accounts

Custom AI model fine-tuning

Webhook support for external integrations

PDF export for generated content

Usage alerts via email

Annual subscription discount

OpenAPI/Swagger documentation

Social login (Google, GitHub)

👨‍💻 Author
Gil — Final year IT student from Zimbabwe, building towards a remote full stack engineering role.

GitHub: @Gil-Ano

Built with ❤️ from Zimbabwe 🇿🇼
