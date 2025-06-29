# utils/extractor.py
import re
from .skill_db import get_skill_list
import spacy


word_to_number = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
    "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
    "nineteen": 19, "twenty": 20
}

nlp = spacy.load("en_core_web_trf")

def extract_name(doc):
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return "Unknown"

def extract_skills(text):
    skills_found = []
    text_lower = text.lower()
    for skill in get_skill_list():
        if skill.lower() in text_lower:
            skills_found.append(skill)
    return ", ".join(set(skills_found))

def extract_experience_years(text):
    patterns = [
        r"(\d+)\+?\s+years? of experience",
        r"over\s+(\d+)\s+years?",
        r"worked for\s+(\d+)\s+years?",
        r"(\d+)\s+years? experience"
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))
    return 0

def extract_education(text):
    patterns = [
        r"(Bachelor(?:'s)?(?: of [A-Za-z]+)?)",
        r"(B\.?Sc(?:\.?)?)",
        r"(Master(?:'s)?(?: of [A-Za-z]+)?)",
        r"(M\.?Sc(?:\.?)?)",
        r"(Ph\.?D(?:\.?)?)"
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    return "Unknown"

def extract_certifications(text):
    # Catch phrases like "Certified AWS Solutions Architect", "Certification in Data Science"
    patterns = [
        r"(Certified\s+[A-Z][\w\s&-]+)",
        r"(Certification in\s+[A-Z][\w\s&-]+)",
        r"(AWS Certified[\w\s-]*)",
        r"(PMP(?:\s+Certified)?)",
        r"(Google\s+Professional\s+[\w\s]+)",
        r"(Cisco\s+Certified[\w\s]+)",
    ]
    certifications = set()
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        certifications.update(matches)
    return ", ".join(certifications) if certifications else "None"

# def extract_projects_count(text):
#     match = re.search(r'(\d+)\s+projects?', text, re.IGNORECASE)
#     return int(match.group(1)) if match else 0


def extract_projects_count(text):
    # 1. Numeric mentions
    patterns = [
        r'(\d+)\s*\+?\s+projects?',
        r'over\s+(\d+)\s+projects?',
        r'worked on\s+(\d+)\s+projects?',
        r'completed\s+(\d+)\s+projects?',
        r'led\s+(\d+)\s+projects?'
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return int(match.group(1))

    # 2. Word-based numbers
    for word, number in word_to_number.items():
        if re.search(rf"{word}\s+projects?", text, re.IGNORECASE):
            return number

    # 3. Detect "project-like" actions without using the word "project"
    action_phrases = [
        r'\bdeveloped\b\s+(an|a)?\s+\w+',
        r'\bbuilt\b\s+(an|a)?\s+\w+',
        r'\bcreated\b\s+(an|a)?\s+\w+',
        r'\bdesigned\b\s+(an|a)?\s+\w+',
        r'\bimplemented\b\s+(an|a)?\s+\w+',
        r'\bengineered\b\s+(an|a)?\s+\w+',
        r'\bdeployed\b\s+(an|a)?\s+\w+',
        r'\bconstructed\b\s+(an|a)?\s+\w+',
        r'\bprogrammed\b\s+(an|a)?\s+\w+'
    ]
    inferred_projects = 0
    for phrase in action_phrases:
        inferred_projects += len(re.findall(phrase, text, re.IGNORECASE))

    # 4. Fallback: count the word "project"
    project_mentions = len(re.findall(r'\bprojects?\b', text, re.IGNORECASE))

    # Return max between detected action-based and "project" word count
    total_estimate = max(inferred_projects, project_mentions)
    return total_estimate if total_estimate > 0 else 0

def parse_resume(text, job_role):
    doc = nlp(text)
    return {
       # "Name": extract_name(doc),
        "Skills": extract_skills(text),
        "Experience (Years)": extract_experience_years(text),
        "Education": extract_education(text),
        "Certifications": extract_certifications(text),
        "Job Role": job_role,
        "Recruiter Decision": "",  # Blank
        "Projects Count": extract_projects_count(text),
        "AI Score (0-100)": "",    # Blank
    }
