# =========================
# IMPORTS
# =========================
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

print("🚀 CKD API Running...")

# =========================
# LOAD NEW MODELS
# =========================
model_B = joblib.load("model_B.pkl")     # RF
model_C = joblib.load("model_C_xgb.pkl")    # XGBoost

columns = joblib.load("columns.pkl")
median = joblib.load("median.pkl")

# =========================
# VALIDATION
# =========================


def validate_input(data):
    errors = []
    required_fields = [
        "age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba",
        "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv",
        "wc", "rc", "htn", "dm", "cad", "appet", "pe", "ane"
    ]

    for field in required_fields:
        if field not in data:
            errors.append(f"{field} missing")

    return errors

# =========================
# PREDICT
# =========================


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        patient_name = data.get("patient_name", "Unknown")

        # CLEAN EMPTY
        for k in data:
            if data[k] == "":
                data[k] = np.nan

        # VALIDATE
        errors = validate_input(data)
        if errors:
            return jsonify({"error": errors}), 400

        # =========================
        # PREPROCESS
        # =========================
        df = pd.DataFrame([data])

        df = df.apply(lambda x: x.astype(str).str.strip().str.lower())

        df = df.replace({
            "yes": 1, "no": 0,
            "normal": 1, "abnormal": 0,
            "present": 1, "notpresent": 0,
            "good": 1, "poor": 0
        })

        df = df.apply(pd.to_numeric, errors="coerce")
        df = df.fillna(median)

        for col in columns:
            if col not in df:
                df[col] = 0

        df = df[columns]

        # =========================
        # MODEL PREDICTION
        # =========================
        prob_B = float(model_B.predict_proba(df)[0][1])   # RF
        prob_C = float(model_C.predict_proba(df)[0][1])   # XGB

        # 🔥 IMPROVED ENSEMBLE (XGB dominant)
        if abs(prob_B - prob_C) < 0.15:
            final_prob = (prob_B + prob_C) / 2
        elif prob_C > 0.75:
            final_prob = prob_C
        elif prob_B > 0.75:
            final_prob = prob_B
        else:
            final_prob = (0.75 * prob_C) + (0.25 * prob_B)

        # =========================
        # THRESHOLD (MEDICAL SAFE)
        # =========================
        threshold = 0.45
        prediction = "ckd" if final_prob >= threshold else "not_ckd"

        # =========================
        # RESPONSE
        # =========================
        return jsonify({
            "patient_name": patient_name,
            "prediction": prediction,
            "confidence": round(final_prob * 100, 2),
            "risk_level": "high" if final_prob > 0.75 else "medium" if final_prob > 0.45 else "low",
            "model_details": {
                "model_B_rf": round(prob_B, 3),
                "model_C_xgb": round(prob_C, 3)
            },
            "inputs": data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
