# 🚀 CV Smart Analyzer

**CV Smart Analyzer** is an AI-powered web application that helps job seekers analyze, improve, and tailor their CVs for better job opportunities.

It provides instant feedback, ATS score estimation, and job matching insights — all in a simple, user-friendly interface.

---

## 🌐 Live Demo

- **Frontend:** https://alonsome.tech  
- **Backend API:** https://api.alonsome.tech  

---

## 🎯 Problem Statement

Many job seekers struggle to understand why their CVs are rejected.  
Most applicants lack access to personalized, actionable feedback on their resumes.

As a result, they submit CVs that:
- Are poorly structured  
- Miss important skills  
- Are not optimized for Applicant Tracking Systems (ATS)  

This project solves that problem by providing an intelligent, AI-powered CV analysis tool.

---

## ✨ Features

### 📄 CV Analysis
- Paste CV text for instant analysis
- Upload CV as PDF
- AI-powered evaluation with structured feedback

### 📊 Smart Feedback
- ATS score estimation (0–100)
- Professional summary
- Strengths & weaknesses
- Missing skills detection
- Actionable improvement suggestions
- Recommended job roles

### 📑 PDF Text Extraction
- Extract readable text from uploaded CV PDFs
- Copy extracted text easily
- Send extracted text directly into the job matcher

### 🎯 Job Description Matcher
- Compare CV against a job description
- Get a match score
- Identify matched and missing skills
- Receive tailored improvement suggestions

---

## 🧠 How It Works

1. Upload or paste your CV  
2. The system analyzes it using AI  
3. You receive structured feedback and recommendations  
4. Optionally, compare your CV against a job description  
5. Improve your CV based on insights provided  

---

## 🛠️ Tech Stack

### Backend
- Python (FastAPI)
- OpenRouter API (LLM-based analysis)
- PyPDF (PDF text extraction)

### Frontend
- HTML, CSS, JavaScript (Vanilla)

### Deployment
- **Frontend:** Vercel  
- **Backend:** Render  

### Version Control
- Git & GitHub

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/elusiee/cv-smart-analyzer.git
cd cv-smart-analyzer

### 2. Setup Backend

cd backend
python -m venv venv

### 3. Activate virtual environment
Windows:

venv\Scripts\activate

Mac/Linux:

source venv/bin/activate

### 4. Install Dependencies

pip install -r requirements.txt

### 5. Add Environment Variables
Create .env inside backend/:
OPENROUTER_API_KEY=your_api_key_here

### 6. Run Backend

uvicorn main:app --reload

### 7. Run Frontend

cd ../frontend
python -m http.server 5500

Open:
http://127.0.0.1:5500


| Endpoint            | Method | Description                   |
| ------------------- | ------ | ----------------------------- |
| `/analyze-text`     | POST   | Analyze pasted CV text        |
| `/analyze-pdf`      | POST   | Analyze uploaded PDF          |
| `/extract-pdf-text` | POST   | Extract text from PDF         |
| `/match-job`        | POST   | Match CV with job description |


### 📁 PROJECT STRUCTURE

cv-smart-analyzer/
│
├── backend/
│   ├── main.py
│   ├── ai.py
│   ├── pdf_utils.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md

⚠️ Notes

- Ensure your API key is valid before running the app
- Free-tier AI APIs may have rate limits
- The system includes fallback handling for reliability

🚀 Future Improvements

- Authentication system (user accounts)
- CV history tracking
- Export results as PDF
- Enhanced UI/UX design
- Support for more file formats

👨‍💻 Author
ELUSIE C. EMMANUEL (Alonsome)