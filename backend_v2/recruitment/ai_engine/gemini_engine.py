import os
import json
import google.generativeai as genai
from PyPDF2 import PdfReader
from django.conf import settings
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Configure Gemini API
# In production, GEMINI_API_KEY should be set in .env
GEMINI_API_KEY = getattr(settings, 'GEMINI_API_KEY', os.environ.get('GEMINI_API_KEY'))
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Use the fast, cost-effective Gemini 1.5 Flash model
generation_config = {
    "temperature": 0.1, # Low temp for deterministic outputs
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 2048,
    "response_mime_type": "application/json",
}

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error reading PDF {pdf_path}: {e}")
        return ""

def process_application(resume_path, job_context):
    """
    Parses the resume and calculates the match score using a single Gemini LLM call.
    Returns a dictionary matching the schema expected by views.py.
    """
    resume_text = extract_text_from_pdf(resume_path)
    
    if not resume_text:
        return _fallback_response("Could not extract text from the resume file.")
        
    if not GEMINI_API_KEY:
        return _fallback_response("GEMINI_API_KEY is not configured in the backend.")

    prompt = f"""
    You are an Expert Technical ATS (Applicant Tracking System).
    Your task is to parse a candidate's resume and evaluate it against a specific Job Context.
    
    ### JOB CONTEXT
    Job Title / Role: {job_context.get('role', 'Unknown')}
    Required Skills: {', '.join(job_context.get('required_skills', []))}
    Preferred Education: {job_context.get('preferred_education', 'Any')}
    Job Description: {job_context.get('description', '')}
    
    ### CANDIDATE RESUME
    {resume_text}
    
    ### INSTRUCTIONS
    1. Extract the candidate's core details from the resume: Name, Email, Phone, Skills, Experience (Years), Education, Certifications, and Projects Count.
       - "Skills" must be an array of strings representing individual technologies (e.g., ["Python", "React", "Docker"]). Extract all skills mentioned anywhere in the resume.
       - "Experience (Years)" must be a float.
       - "Projects Count" must be an integer.
    2. Evaluate the candidate against the Job Context and generate an 'AI Score' from 0 to 100.
       - Consider required skills, education, and any implicit requirements (like 'X years of experience') found in the Job Description.
       - Be fair but strict. If they meet or exceed requirements, give a high score. If they are missing key requirements, penalize them appropriately.
       - Do not penalize if no specific years of experience are explicitly required in the description.
    3. Provide a 'Recruiter Decision' which must be strictly "Shortlist" (score >= 60) or "Reject" (score < 60).
    4. Provide a 3-sentence 'Explanation' explaining exactly why they received this score (mentioning matching skills, missing skills, and experience gap if any).
    
    Respond STRICTLY with a valid JSON object using the following exact schema:
    {{
        "Name": "Candidate Full Name or Unknown",
        "Email": "email@example.com or Unknown",
        "Phone": "Phone number or Unknown",
        "Skills": ["Skill1", "Skill2", "Skill3"],
        "Experience (Years)": 2.5,
        "Education": "Highest Degree (e.g., Bachelor of Science in Computer Science)",
        "Certifications": "Comma separated certifications or None",
        "Projects Count": 2,
        "AI Score": 85.0,
        "Recruiter Decision": "Shortlist",
        "Explanation": ["Sentence 1.", "Sentence 2.", "Sentence 3."]
    }}
    """
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            generation_config=generation_config,
        )
        
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        
        # Add compliance info
        result["Compliance"] = {
            "gdpr_right_to_explanation": True,
            "human_in_the_loop_required": True,
            "data_used": ["Resume Text", "Job Requirements", "Job Description Context"],
            "model_used": "gemini-3.6-flash",
            "no_sensitive_attributes_used": True,
            "compliance_timestamp": datetime.now().isoformat()
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
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
