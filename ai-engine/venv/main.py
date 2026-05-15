from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import pymupdf
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ClarixAI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ResumeRequest(BaseModel):
    resume: str
    jobDescription: str

class CoverLetterRequest(BaseModel):
    resume: str
    jobDescription: str
    companyName: str

class InterviewRequest(BaseModel):
    jobTitle: str
    skills: str

class ContentRequest(BaseModel):
    content: str
    tone: str
    type: str

class CodeRequest(BaseModel):
    code: str
    language: str

def ask_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )
    return response.choices[0].message.content

@app.get("/")
def root():
    return {"message": "ClarixAI Python Engine running"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        doc = pymupdf.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-resume")
def analyze_resume(data: ResumeRequest):
    prompt = f"""Analyze this resume against the job description and provide:
1. Match score (0-100)
2. Missing skills
3. Strengths
4. Specific improvements

Resume: {data.resume}

Job Description: {data.jobDescription}

Format your response clearly with sections."""
    return {"result": ask_groq(prompt)}

@app.post("/cover-letter")
def cover_letter(data: CoverLetterRequest):
    prompt = f"""Write a professional cover letter for this job application.
Company: {data.companyName}
Job Description: {data.jobDescription}
Resume/Background: {data.resume}"""
    return {"result": ask_groq(prompt)}

@app.post("/interview-questions")
def interview_questions(data: InterviewRequest):
    prompt = f"""Generate 10 interview questions for a {data.jobTitle} position.
Key skills: {data.skills}
Include technical, behavioral and situational questions with tips."""
    return {"result": ask_groq(prompt)}

@app.post("/content-rewriter")
def content_rewriter(data: ContentRequest):
    prompt = f"""Rewrite the following {data.type} in a {data.tone} tone.
Original: {data.content}"""
    return {"result": ask_groq(prompt)}

@app.post("/code-explainer")
def code_explainer(data: CodeRequest):
    prompt = f"""Explain this {data.language} code in simple terms:
{data.code}
Explain what it does, each important part, and any potential issues."""
    return {"result": ask_groq(prompt)}