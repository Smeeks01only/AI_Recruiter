import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import accuracy_score

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
MODEL_FILE = os.path.join(MODELS_DIR, 'classification_model.pkl')

def detect_bias(sensitive_column='Gender', label_column='Recruiter Decision'):
    """
    Analyzes bias by comparing prediction rates across groups in the sensitive column.
    """
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'AI_Resume_Screening.csv'))
        model = joblib.load(MODEL_FILE)

        # Preprocessing (same as training)
        df = df.drop(columns=["Resume_ID", "Name", "Salary Expectation ($)"], errors='ignore')
        df.fillna("None", inplace=True)
        df['Recruiter Decision'] = df['Recruiter Decision'].map({'Hire': 1, 'Reject': 0})

        # Encode categorical
        encoders = {
            col: joblib.load(os.path.join(MODELS_DIR, f'{col.lower().replace(" ", "_")}_encoder.pkl'))
            for col in ['Education', 'Certifications', 'Job Role']
        }

        for col, encoder in encoders.items():
            df[col] = encoder.transform(df[col].astype(str))

        # MultiLabel encode skills
        mlb = joblib.load(os.path.join(MODELS_DIR, 'multilabelbinarizer.pkl'))
        df['Skills'] = df['Skills'].apply(lambda x: [s.strip() for s in x.split(',')])
        skills_encoded = mlb.transform(df['Skills'])
        skills_df = pd.DataFrame(skills_encoded, columns=mlb.classes_, index=df.index)
        df = pd.concat([df.drop('Skills', axis=1), skills_df], axis=1)

        # Predict
        feature_columns = joblib.load(os.path.join(MODELS_DIR, 'feature_columns.pkl'))
        X = df[feature_columns]
        y_true = df[label_column]
        y_pred = model.predict(X)

        df['prediction'] = y_pred
        df['actual'] = y_true

        if sensitive_column not in df.columns:
            return {"error": f"{sensitive_column} column not found."}

        # Group bias report
        report = {}
        groups = df[sensitive_column].unique()
        for group in groups:
            subset = df[df[sensitive_column] == group]
            selection_rate = np.mean(subset['prediction'])
            actual_rate = np.mean(subset['actual'])
            report[group] = {
                "group_size": len(subset),
                "selection_rate": round(selection_rate, 3),
                "actual_positive_rate": round(actual_rate, 3),
                "accuracy": round(accuracy_score(subset['actual'], subset['prediction']), 3)
            }

        # Disparate impact (80% rule)
        rates = [r["selection_rate"] for r in report.values()]
        if len(rates) > 1:
            min_rate = min(rates)
            max_rate = max(rates)
            disparate_impact = round(min_rate / max_rate, 3) if max_rate > 0 else None
        else:
            disparate_impact = None

        return {
            "bias_report": report,
            "disparate_impact": disparate_impact,
            "conclusion": "⚠️ Potential bias detected." if disparate_impact and disparate_impact < 0.8 else "✅ No strong bias detected."
        }

    except Exception as e:
        return {"error": str(e)}
