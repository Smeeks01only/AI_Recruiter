# recruitment/ai_engine/ml_models_utils.py

import joblib
import numpy as np
import pandas as pd
import shap
import os
from django.conf import settings

# --- Loading section (no changes here) ---
MODELS_DIR = os.path.join(settings.BASE_DIR, 'models')
classification_model = joblib.load(os.path.join(MODELS_DIR, 'classification_model.pkl'))
regression_model = joblib.load(os.path.join(MODELS_DIR, 'regression_model.pkl'))
education_encoder = joblib.load(os.path.join(MODELS_DIR, 'education_encoder.pkl'))
certifications_encoder = joblib.load(os.path.join(MODELS_DIR, 'certifications_encoder.pkl'))
job_role_encoder = joblib.load(os.path.join(MODELS_DIR, 'job_role_encoder.pkl'))
skill_binarizer = joblib.load(os.path.join(MODELS_DIR, 'multilabelbinarizer.pkl'))
FEATURE_COLUMNS = joblib.load(os.path.join(MODELS_DIR, 'feature_columns.pkl'))

# --- Helper functions (no changes here) ---
def safe_label_encode(encoder, value, fallback='Other'):
    if value not in encoder.classes_:
        if fallback not in encoder.classes_:
            encoder.classes_ = np.append(encoder.classes_, fallback)
        value = fallback
    return encoder.transform([value])[0]

def filter_known_skills(skills, binarizer):
    known = set(binarizer.classes_)
    return [skill for skill in skills if skill in known]


def predict_resume(data):
    # --- Part 1 & 2: Data Preprocessing and Feature Engineering (no changes) ---
    raw_skills = data.get('Skills', '')
    skills = [s.strip() for s in raw_skills.split(',') if s.strip()] if isinstance(raw_skills, str) else raw_skills
    skills = filter_known_skills(skills, skill_binarizer)
    
    experience = float(data.get('Experience (Years)', 0))
    education = data.get('Education', 'Unknown')
    certifications = data.get('Certifications', 'None')
    job_role = data.get('Job Role', 'Unknown')
    projects = int(data.get('Projects Count', 0))

    feature_dict = {}
    skills_encoded = skill_binarizer.transform([skills])
    for i, skill_name in enumerate(skill_binarizer.classes_):
        feature_dict[skill_name] = skills_encoded[0][i]
        
    feature_dict['Experience (Years)'] = experience
    feature_dict['Projects Count'] = projects
    feature_dict['Education'] = safe_label_encode(education_encoder, education, fallback='Other')
    feature_dict['Certifications'] = safe_label_encode(certifications_encoder, certifications, fallback='None')
    feature_dict['Job Role'] = safe_label_encode(job_role_encoder, job_role, fallback='Other')

    # --- Part 3: Create DataFrame and Predict (no changes) ---
    features_df = pd.DataFrame([feature_dict])
    features_df = features_df[FEATURE_COLUMNS]

    recruiter_decision = classification_model.predict(features_df)[0]
    ai_score = regression_model.predict(features_df)[0]
    
    # --- ⭐️ Part 4: NEW Human-Readable Explanation Logic ⭐️ ---
    explainer = shap.Explainer(regression_model)
    shap_values = explainer(features_df)

    top_contributors = sorted(
        zip(features_df.columns, shap_values[0].values),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:5]

    explanation_sentences = []
    known_skill_set = set(skill_binarizer.classes_)

    for feature, value in top_contributors:
        # We can skip factors with almost no impact
        if abs(value) < 0.1:
            continue

        display_feature = feature.replace('_', ' ')
        is_positive = value > 0
        sentence = ""

        if feature == 'Experience (Years)':
            if is_positive:
                sentence = f"The candidate's {int(experience)} years of experience is a strong asset for this role."
            else:
                sentence = f"The {int(experience)} years of experience is lower than desired, which negatively impacted the score."
        
        elif feature == 'Projects Count':
            if is_positive:
                sentence = f"A portfolio of {int(projects)} project(s) demonstrates valuable practical skill."
            else:
                sentence = f"The number of projects ({int(projects)}) was considered low, which reduced the score."

        elif feature in known_skill_set:
            if is_positive:
                sentence = f"The skill '{display_feature}' is highly relevant and significantly boosted the candidate's score."
            else:
                sentence = f"The skill '{display_feature}' was considered less relevant for this specific position."

        elif feature == 'Education':
            if is_positive:
                sentence = f"The educational background of '{education}' is a significant advantage."
            else:
                sentence = f"The education level ('{education}') did not meet the role's preferred qualifications."
        
        elif feature == 'Certifications':
            if certifications == 'None' and not is_positive:
                sentence = "Lacking specific certifications was a factor that lowered the score."
            elif is_positive:
                sentence = f"Holding the '{certifications}' certification is a strong positive signal."
            else:
                sentence = f"The '{certifications}' certification was not considered a strong fit for this role's requirements."

        elif feature == 'Job Role':
            if is_positive:
                sentence = f"The candidate's profile is an excellent match for the '{job_role}' position."
            else:
                sentence = f"There may be a mismatch between the candidate's profile and the requirements for the '{job_role}' position."

        if sentence:
            explanation_sentences.append(sentence)

    # Add a fallback message if no significant factors were found
    if not explanation_sentences:
        explanation_sentences.append("The AI analysis did not highlight any single overriding factors for this score.")
        
    compliance_info = {
    "gdpr_right_to_explanation": True,
    "human_in_the_loop_required": True,
    "data_used": list(features_df.columns),
    "no_sensitive_attributes_used": True,
    "compliance_timestamp": pd.Timestamp.now().isoformat()
}

    return {
        'Recruiter Decision': str(recruiter_decision),
        'AI Score': round(float(ai_score), 2),
        'Explanation': explanation_sentences,  # Return the list of friendly sentences
        'Compliance': compliance_info
    }