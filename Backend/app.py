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
# LOAD MODELS
# =========================
rf_model = joblib.load("random_forest_model (1).joblib")
xgb_model = joblib.load("xgboost_model.joblib")

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
        # MODEL
        # =========================
        rf_prob = float(rf_model.predict_proba(df)[0][1])
        xgb_prob = float(xgb_model.predict_proba(df)[0][1])

        final_prob = (0.7 * xgb_prob) + (0.3 * rf_prob)

        # ✅ FIXED FORMAT
        prediction = "ckd" if final_prob > 0.5 else "not_ckd"

        # =========================
        # RESPONSE
        # =========================
        return jsonify({
            "patient_name": patient_name,
            "prediction": prediction,
            "confidence": round(final_prob * 100, 2),
            "risk_level": "high" if final_prob > 0.75 else "medium" if final_prob > 0.5 else "low",
            "inputs": data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
