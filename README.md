# CV Smart Analyzer

CV Smart Analyzer is a simple AI-powered web app that helps users review and improve their CVs.
AI-powered CV analysis tool that helps job seekers improve ATS score and job readiness.

## Features
- Paste CV text for instant analysis
- Upload CV as PDF
- Get ATS score estimate
- View strengths, weaknesses, missing skills, and improvement suggestions
- Copy result for reuse

## Tech Stack
- FastAPI (Python)
- HTML, CSS, JavaScript
- OpenAI API
- pypdf

## Run locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
Open `frontend/index.html` in your browser.

## Environment
Create a `.env` file in `backend/`:

```env
OPENAI_API_KEY=your_api_key_here
```
