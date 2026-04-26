# =========================
# 1. IMPORTS
# =========================
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

print("🚀 Starting CKD Ensemble API...")

app = Flask(__name__)
CORS(app)

# =========================
# 2. LOAD MODELS + FILES
# =========================
rf_model = joblib.load("random_forest_model (1).joblib")
xgb_model = joblib.load("xgboost_model.joblib")

columns = joblib.load("columns.pkl")
median = joblib.load("median.pkl")

# =========================
# 3. VALIDATION
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
# 4. HOME ROUTE
# =========================


@app.route("/")
def home():
    return "✅ CKD Ensemble API is running"

# =========================
# 5. PREDICTION ROUTE
# =========================


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Handle empty values
        for key in data:
            if data[key] == "":
                data[key] = np.nan

        # Validate
        errors = validate_input(data)
        if errors:
            return jsonify({"error": "Invalid input", "details": errors}), 400

        # =========================
        # PREPROCESSING
        # =========================
        df_input = pd.DataFrame([data])

        df_input = df_input.apply(
            lambda x: x.astype(str).str.strip().str.lower())

        df_input = df_input.replace({
            "yes": 1, "no": 0,
            "normal": 1, "abnormal": 0,
            "present": 1, "notpresent": 0,
            "good": 1, "poor": 0
        })

        df_input = df_input.apply(pd.to_numeric, errors="coerce")
        df_input = df_input.fillna(median)

        for col in columns:
            if col not in df_input:
                df_input[col] = 0

        df_input = df_input[columns]

        # =========================
        # MODEL PREDICTION
        # =========================
        rf_prob = float(rf_model.predict_proba(df_input)[0][1])
        xgb_prob = float(xgb_model.predict_proba(df_input)[0][1])

        final_prob = (0.7 * xgb_prob) + (0.3 * rf_prob)

        result = "Yes" if final_prob > 0.50 else "No"

        # =========================
        # HEALTH WARNINGS + SEVERITY
        # =========================
        warnings = []
        recommendations = []

        bp = float(data.get("bp", 0))
        sc = float(data.get("sc", 0))
        hemo = float(data.get("hemo", 0))
        bgr = float(data.get("bgr", 0))
        bu = float(data.get("bu", 0))
        sod = float(data.get("sod", 0))
        pot = float(data.get("pot", 0))

        # BP
        if bp > 160:
            warnings.append("🔴 Critical High Blood Pressure")
            recommendations.append(
                "🚨 Immediate medical attention required for blood pressure")
        elif bp > 140:
            warnings.append("🟠 High Blood Pressure")
            recommendations.append(
                "Reduce salt intake and monitor BP regularly")
        elif bp > 130:
            warnings.append("🟡 Slightly Elevated Blood Pressure")

        # Creatinine
        if sc > 2:
            warnings.append("🔴 Critical Creatinine Level")
            recommendations.append(
                "🚨 Kidney function severely affected — consult nephrologist urgently")
        elif sc > 1.2:
            warnings.append("🟠 Elevated Creatinine")
            recommendations.append("Monitor kidney function and stay hydrated")

        # Hemoglobin
        if hemo < 10:
            warnings.append("🔴 Critical Low Hemoglobin")
            recommendations.append(
                "🚨 Severe anemia — consult doctor immediately")
        elif hemo < 12:
            warnings.append("🟠 Low Hemoglobin")
            recommendations.append("Increase iron intake")

        # Sugar
        if bgr > 200:
            warnings.append("🔴 Critical Blood Sugar")
            recommendations.append("🚨 High diabetes risk — consult doctor")
        elif bgr > 140:
            warnings.append("🟠 High Blood Sugar")
            recommendations.append("Control sugar intake")

        # Urea
        if bu > 80:
            warnings.append("🔴 Critical Blood Urea")
            recommendations.append("🚨 Kidney dysfunction — seek medical help")
        elif bu > 40:
            warnings.append("🟠 High Blood Urea")

        # Sodium
        if sod < 130 or sod > 150:
            warnings.append("🔴 Critical Sodium Level")
            recommendations.append("🚨 Electrolyte imbalance — consult doctor")
        elif sod < 135 or sod > 145:
            warnings.append("🟠 Abnormal Sodium")

        # Potassium
        if pot < 3 or pot > 6:
            warnings.append("🔴 Critical Potassium Level")
            recommendations.append(
                "🚨 Dangerous potassium imbalance — urgent care")
        elif pot < 3.5 or pot > 5.0:
            warnings.append("🟠 Abnormal Potassium")

        # Global advice
        if any("🔴" in w for w in warnings):
            recommendations.append(
                "⚠️ Critical condition detected — consult a doctor immediately")

        # =========================
        # RESPONSE
        # =========================
        return jsonify({
            "ckd_detected": result,
            "confidence": round(final_prob * 100, 2),
            "xgb_confidence": round(xgb_prob * 100, 2),
            "rf_confidence": round(rf_prob * 100, 2),
            "warnings": warnings,
            "recommendations": recommendations
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500


# =========================
# 6. RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
