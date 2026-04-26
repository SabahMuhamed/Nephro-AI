import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

print("Starting Flask app...")

app = Flask(__name__)
CORS(app)

# =========================
# LOAD MODEL FILES
# =========================
model = joblib.load("kidney.pkl")
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
            errors.append(f"{field} is missing")

    try:
        if float(data.get("age", 0)) <= 0:
            errors.append("Age must be > 0")

        if float(data.get("bp", 0)) <= 0:
            errors.append("BP must be > 0")

        if float(data.get("sc", 0)) <= 0:
            errors.append("Creatinine must be > 0")

        if float(data.get("hemo", 0)) <= 0:
            errors.append("Hemoglobin must be > 0")

    except:
        errors.append("Invalid numeric values")

    return errors


# =========================
# ROUTES
# =========================
@app.route("/")
def home():
    return "CKD Prediction API is running 🚀"


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Handle empty values
        for key in data:
            if data[key] == "":
                data[key] = np.nan

        # Validate input
        errors = validate_input(data)
        if errors:
            return jsonify({
                "error": "Invalid input",
                "details": errors
            }), 400

        # Convert to DataFrame
        df_input = pd.DataFrame([data])

        # =========================
        # PREPROCESSING (same as training)
        # =========================
        df_input = df_input.apply(
            lambda x: x.astype(str).str.lower().str.strip())

        df_input = df_input.replace({
            "yes": 1, "no": 0,
            "normal": 1, "abnormal": 0,
            "present": 1, "notpresent": 0,
            "good": 1, "poor": 0
        })

        df_input = df_input.apply(pd.to_numeric, errors="coerce")
        df_input = df_input.fillna(median)

        # Ensure correct column order
        for col in columns:
            if col not in df_input:
                df_input[col] = 0

        df_input = df_input[columns]

        # =========================
        # MODEL PREDICTION
        # =========================
        pred_class = model.predict(df_input)[0]

        labels = {
            0: "No Disease",
            1: "Low Risk",
            2: "Moderate Risk",
            3: "High Risk"
        }

        # Default from model
        risk_level = labels[pred_class]

        # =========================
        # RULE-BASED OVERRIDE (CRITICAL FIX)
        # =========================
        sc = float(data.get("sc", 0))
        bp = float(data.get("bp", 0))
        hemo = float(data.get("hemo", 0))

        # =========================
        # SCORING SYSTEM (0–100)
        # =========================

        score = 0

        # Creatinine (sc)
        if sc > 2:
            score += 40
        elif sc > 1.2:
            score += 25
        elif sc > 1.0:
            score += 10

# Blood Pressure (bp)
        if bp > 160:
            score += 30
        elif bp > 140:
            score += 20
        elif bp > 130:
            score += 10

# Hemoglobin (hemo)
        if hemo < 10:
            score += 30
        elif hemo < 12:
            score += 20
        elif hemo < 13:
            score += 10

# Clamp score to 100
        score = min(score, 100)

        # Default (best case)
        risk_level = "No Disease"

# Low Risk (slightly abnormal)
        if sc > 1.0 or bp > 130 or hemo < 13:
            risk_level = "Low Risk"

# Moderate Risk
        if sc > 1.2 or bp > 140 or hemo < 12:
            risk_level = "Moderate Risk"

# High Risk (severe)
        if sc > 2 or bp > 160 or hemo < 10:
            risk_level = "High Risk"

        # =========================
        # FINAL YES/NO DECISION
        # =========================
        if risk_level == "No Disease":
            result = "No"
        else:
            result = "Yes"

        # =========================
        # CAUSES
        # =========================
        causes = []

        if sc > 1.2:
            causes.append("High Creatinine (Kidney issue)")

        if bp > 140:
            causes.append("High Blood Pressure")

        if hemo < 12:
            causes.append("Low Hemoglobin (Anemia risk)")

        # =========================
        # RECOMMENDATIONS
        # =========================
        recommendations = []

        if "High Creatinine (Kidney issue)" in causes:
            recommendations.append("Consult nephrologist immediately")

        if "High Blood Pressure" in causes:
            recommendations.append("Reduce salt intake")

        if "Low Hemoglobin (Anemia risk)" in causes:
            recommendations.append("Increase iron intake")

        if not recommendations:
            recommendations.append("Maintain healthy lifestyle")

        # =========================
        # PREVENTION
        # =========================
        prevention = [
            "Drink enough water",
            "Exercise regularly",
            "Avoid excess salt",
            "Regular kidney checkups",
            "Avoid overuse of painkillers"
        ]

        # =========================
        # FINAL RESPONSE
        # =========================
        return jsonify({
            "ckd_detected": result,
            "risk_level": risk_level,
            "risk_score": score,
            "causes": causes,
            "recommendations": recommendations,
            "prevention": prevention
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500


# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    app.run(debug=True)
