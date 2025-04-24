import joblib
import numpy as np
import pandas as pd
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'injury_prediction_model.pkl')
model = joblib.load(MODEL_PATH)

def analyze_player(data: dict) -> dict:
    # استخرجنا القيم
    age = data['age']
    weight = data['weight']
    height = data['height']
    prev = data['previousInjuries']
    intensity = data['trainingIntensity']
    rec_days = data['recoveryDays']

    # الميّزتان المستنتجتان
    bmi = weight / ((height / 100) ** 2)
    recovery_ratio = rec_days / (age + 1)

    # بناء DataFrame بنفس أسماء الأعمدة التي درّب عليها الموديل
    feature_names = model.feature_names_in_
    X = pd.DataFrame([[
        age, weight, height, prev, intensity, rec_days, bmi, recovery_ratio
    ]], columns=feature_names)

    pred = model.predict(X)[0]
    prob = model.predict_proba(X)[0][1]

    classification = 'خطر عالي' if pred == 1 else 'خطر منخفض'
    recommendation = (
        "راجع طبيب أو قلل شدة التمرين." if pred == 1 
        else "متابعة الروتين الرياضي الطبيعي."
    )

    return {
        "risk_percent": round(prob * 100, 2),
        "classification": classification,
        "recommendation": recommendation
    }
