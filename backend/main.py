from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import analyze_cv_text, match_cv_to_job
from pdf_utils import extract_text_from_pdf_bytes

app = FastAPI(title="CV Smart Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://alonsome.tech",
    "https://www.alonsome.tech"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CVTextRequest(BaseModel):
    cv_text: str


@app.get("/")
def root():
    return {"message": "CV Smart Analyzer API is running"}


@app.post("/analyze-text")
def analyze_text(payload: CVTextRequest):
    result = analyze_cv_text(payload.cv_text)
    return {"success": True, "data": result}


@app.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"success": False, "error": "Only PDF files are allowed."}

    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf_bytes(file_bytes)

    if not extracted_text.strip():
        return {"success": False, "error": "Could not extract text from this PDF."}

    result = analyze_cv_text(extracted_text)
    return {
        "success": True,
        "extracted_text_preview": extracted_text[:1000],
        "data": result,
    }
    
@app.post("/match-job")
async def match_job(cv_text: str = Form(...), job_desc: str = Form(...)):
    result = match_cv_to_job(cv_text, job_desc)
    return {"success": True, "data": result}
