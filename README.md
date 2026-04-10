# SafeLy - Dynamic AI Scam Simulation Engine 🛡️

SafeLy is an advanced React + FastAPI application designed to train users against modern cyber-threats seamlessly. Its flagship feature, the **Dynamic Multi-Platform AI Siren**, leverages real-time community reports to dynamically synthesize interactive training simulations on the fly. 

Whenever a user reports a scam in the Neighborhood Watch feed, the backend LLM engine models the threat, predicts the specific attack vector, and dynamically morphs the frontend React application into a high-fidelity WhatsApp, SMS, or Email environment.

## 🚀 Key Features

* **Real-Time Threat Ingestion**: Users can instantly post short descriptions of suspicious activity to the community feed.
* **1-to-1 AI Threat Modeling**: The backend isolates the newest report and queries **Groq's Llama-3.3-70b** model to construct a bespoke, interactive 3-step conversational simulation based *exactly* on the user's claim.
* **Component Morphing**: The `CommunityQuiz.tsx` engine reads the AI's JSON output and shifts layouts instantly. It completely restructures itself to faithfully replicate standard WhatsApp Green bubbles, iOS/Android SMS screens, or Red Gmail-style Inbox interfaces based on the AI's threat vector analysis.
* **Bilingual Support**: All synthesized scams optionally output parallel translations (English/Hindi) to train Indian demographics flawlessly.

## 🛠️ Technology Stack

* **Frontend**: React, Vite, TypeScript, TailwindCSS, Motion (Framer Motion), Lucide Icons.
* **Backend**: FastAPI, SQLModel, PostgreSQL (NeonDB serverless), Python.
* **AI Infrastructure**: Groq SDK (`llama-3.3-70b-versatile`).

## 💻 Running the Application Locally

### 1. Database & Environment Setup
Navigate into the `backend/` directory and create a `.env` file:
```env
DATABASE_URL="postgresql://[your_neon_db_url]?sslmode=require"
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### 2. Booting the Backend (FastAPI)
Open a terminal inside the project root and start the Python server:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```
*The API will boot on `http://127.0.0.1:8000`.*

### 3. Booting the Frontend (Vite)
Open a second terminal window simultaneously and run the React app:
```bash
cd frontend
npm install
npm run dev
```
*The UI will boot on `http://localhost:5173`. Navigate to the "Community Siren" tab to interact with the LLM pipeline.*

## 📂 Architecture Note
The LLM pipeline revolves around `backend/services.py` containing the extreme-constraint prompt JSON mapping, which injects perfectly formatted platform schemas into `DailyWarning` components, fetched independently by `frontend/src/app/screens/CommunitySiren.tsx`.
