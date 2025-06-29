import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import joblib
from django.conf import settings
import logging

# Configure logging
logger = logging.getLogger(__name__)

# --- Configuration ---
# Assume your training data is in a 'data' folder at the project root
DATA_DIR = os.path.join(settings.BASE_DIR, 'data')
MODELS_DIR = os.path.join(settings.BASE_DIR, 'models')
TRAINING_DATA_FILE = 'AI_Resume_Screening.csv' # Your training data file

def train_and_save_models():
    """
    Loads the dataset, trains the ML models and encoders, and saves them
    to the 'models' directory, overwriting existing files.
    """
    try:
        data_path = os.path.join(DATA_DIR, TRAINING_DATA_FILE)
        logger.info(f"Starting model retraining process from data: {data_path}")

        if not os.path.exists(data_path):
            logger.error(f"Training data not found at {data_path}")
            raise FileNotFoundError("Training data file not found.")

        # --- 1. Load and Preprocess Data ---
        df = pd.read_csv(data_path)
        df = df.drop(columns=["Resume_ID", "Name", "Salary Expectation ($)"], errors='ignore')
        df.fillna("None", inplace=True)

        # --- 2. Feature Engineering & Encoding ---
        # Encode 'Recruiter Decision'
        df['Recruiter Decision'] = df['Recruiter Decision'].map({'Hire': 1, 'Reject': 0})

        # Encode categorical columns and save the encoders
        encoders = {}
        for col in ['Education', 'Certifications', 'Job Role']:
            encoder = LabelEncoder()
            df[col] = encoder.fit_transform(df[col].astype(str))
            encoders[col] = encoder
        
        joblib.dump(encoders['Education'], os.path.join(MODELS_DIR, 'education_encoder.pkl'))
        joblib.dump(encoders['Certifications'], os.path.join(MODELS_DIR, 'certifications_encoder.pkl'))
        joblib.dump(encoders['Job Role'], os.path.join(MODELS_DIR, 'job_role_encoder.pkl'))
        logger.info("Saved LabelEncoders.")

        # Multi-hot encode 'Skills' and save the binarizer
        # Ensure skills are split correctly
        df['Skills'] = df['Skills'].apply(lambda x: [s.strip() for s in x.split(',')])
        mlb = MultiLabelBinarizer()
        skills_encoded = mlb.fit_transform(df['Skills'])
        skills_df = pd.DataFrame(skills_encoded, columns=mlb.classes_, index=df.index)
        
        df = pd.concat([df.drop('Skills', axis=1), skills_df], axis=1)
        joblib.dump(mlb, os.path.join(MODELS_DIR, 'multilabelbinarizer.pkl'))
        logger.info("Saved MultiLabelBinarizer.")

        # --- 3. Define Features (X) and Targets (y) ---
        X = df.drop(['Recruiter Decision', 'AI Score (0-100)'], axis=1)
        y_class = df['Recruiter Decision']
        y_score = df['AI Score (0-100)']

        # Save the feature column order
        feature_columns = list(X.columns)
        joblib.dump(feature_columns, os.path.join(MODELS_DIR, 'feature_columns.pkl'))
        logger.info("Saved feature column list.")

        # --- 4. Train Models ---
        logger.info("Training Classification Model...")
        clf = RandomForestClassifier(random_state=42)
        clf.fit(X, y_class)
        joblib.dump(clf, os.path.join(MODELS_DIR, 'classification_model.pkl'))
        logger.info("Classification Model trained and saved.")

        logger.info("Training Regression Model...")
        reg = RandomForestRegressor(random_state=42)
        reg.fit(X, y_score)
        joblib.dump(reg, os.path.join(MODELS_DIR, 'regression_model.pkl'))
        logger.info("Regression Model trained and saved.")

        # --- 5. Save Last Trained Timestamp ---
        # We can store this in a simple file or in the database.
        # A file is simpler for this example.
        last_trained_path = os.path.join(MODELS_DIR, 'last_trained.txt')
        with open(last_trained_path, 'w') as f:
            from datetime import datetime
            f.write(datetime.now().isoformat())
        
        logger.info("--- Model Retraining Completed Successfully ---")
        return True

    except Exception as e:
        logger.error(f"An error occurred during model retraining: {e}", exc_info=True)
        return False
