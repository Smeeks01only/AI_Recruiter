import os
import json
from groq import Groq
import pdfplumber
import docx2txt
from django.conf import settings
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Configure Groq API (we kept the filename gemini_engine.py so imports don't break)
GROQ_API_KEY = getattr(settings, 'GROQ_API_KEY', os.environ.get('GROQ_API_KEY'))
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)
else:
    client = None

def extract_text_from_pdf(pdf_path):
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if not text.strip():
            return "ERROR_EMPTY_PDF: The PDF contains no extractable text. It might be an image-based scan, which requires OCR (Optical Character Recognition) to parse."
        return text.strip()
    except Exception as e:
        logger.error(f"Error reading PDF {pdf_path}: {e}")
        return f"ERROR_READING_PDF: {str(e)}"

def extract_text_from_word(doc_path):
    try:
        text = docx2txt.process(doc_path)
        if not text.strip():
            return "ERROR_EMPTY_DOC: The Word document contains no extractable text."
        return text.strip()
    except Exception as e:
        logger.error(f"Error reading Word Document {doc_path}: {e}")
        return f"ERROR_READING_DOC: {str(e)}"

def process_application(resume_path, job_context):
    """
    Parses the resume and calculates the match score using a single Groq LLM call.
    Returns a dictionary matching the schema expected by views.py.
    """
    resume_path_lower = resume_path.lower()
    if resume_path_lower.endswith('.docx') or resume_path_lower.endswith('.doc'):
        resume_text = extract_text_from_word(resume_path)
    else:
        resume_text = extract_text_from_pdf(resume_path)
    
    if resume_text.startswith("ERROR"):
        return _fallback_response(f"PDF Extraction Failed: {resume_text}")
        
    # Truncate extremely long CVs to prevent blowing up the free tier token limits (Max ~3500 tokens)
    max_chars = 15000 
    if len(resume_text) > max_chars:
        resume_text = resume_text[:max_chars] + "\n...[TRUNCATED FOR LENGTH]"
        
    if not client:
        return _fallback_response("GROQ_API_KEY is not configured in the backend.")

    system_prompt = f"""You are an Expert Technical ATS (Applicant Tracking System).
Your task is to parse a candidate's resume and evaluate it against a specific Job Context.

### JOB CONTEXT
Job Title / Role: {job_context.get('role', 'Unknown')}
Required Skills: {', '.join(job_context.get('required_skills', []))}
Preferred Education: {job_context.get('preferred_education', 'Any')}
Job Description: {job_context.get('description', '')}

### INSTRUCTIONS
1. Extract the candidate's core details from the resume: Name, Email, Phone, Skills, Experience (Years), Education, Certifications, and Projects Count.
   - "Skills" must be an array of strings representing individual technologies. Extract all skills mentioned anywhere in the resume.
   - "Experience (Years)" must be a float.
   - "Projects Count" must be an integer.
2. Evaluate the candidate against the Job Context and generate an 'AI Score' from 0 to 100.
   - **STRICT EDUCATION SCORING**: You must be extremely strict regarding the 'Preferred Education' and qualifications. 
   - If a candidate does NOT meet the specific education requirements, you must heavily penalize their score (they must NOT receive a high score).
   - **DEGREE EQUIVALENCY RULE**: An MBA is a business degree and MUST NOT be considered equal to an MSc in IT, Computer Science, or any related technical field. Do not give technical education credit for business degrees.
3. Provide a 'Recruiter Decision' which must be strictly "Shortlist" (score >= 60) or "Reject" (score < 60).
4. Provide a 3-sentence 'Explanation' explaining exactly why they received this score.

You must respond STRICTLY with a valid JSON object matching this exact schema:
{{
    "Name": "Candidate Full Name or Unknown",
    "Email": "email@example.com or Unknown",
    "Phone": "Phone number or Unknown",
    "Skills": ["Skill1", "Skill2", "Skill3"],
    "Experience (Years)": 2.5,
    "Education": "Highest Degree",
    "Certifications": "Comma separated certifications or None",
    "Projects Count": 2,
    "AI Score": 85.0,
    "Recruiter Decision": "Shortlist",
    "Explanation": ["Sentence 1.", "Sentence 2.", "Sentence 3."]
}}
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"### CANDIDATE RESUME\n{resume_text}"
                }
            ],
            model="openai/gpt-oss-120b",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        text = chat_completion.choices[0].message.content
        result = json.loads(text)
        
        # Add compliance info
        result["Compliance"] = {
            "gdpr_right_to_explanation": True,
            "human_in_the_loop_required": True,
            "data_used": ["Resume Text", "Job Requirements", "Job Description Context"],
            "model_used": "openai/gpt-oss-120b (Groq)",
            "no_sensitive_attributes_used": True,
            "compliance_timestamp": datetime.now().isoformat()
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        return _fallback_response(f"AI Engine failed to process application: {str(e)}")


def _fallback_response(error_message):
    return {
        "Name": "Unknown",
        "Email": "Unknown",
        "Phone": "Unknown",
        "Skills": [],
        "Experience (Years)": 0,
        "Education": "Unknown",
        "Certifications": "None",
        "Projects Count": 0,
        "AI Score": 0.0,
        "Recruiter Decision": "Reject",
        "Explanation": [error_message],
        "Compliance": {}
    }
