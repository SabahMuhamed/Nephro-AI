import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report
import joblib

# =========================
# 1. LOAD DATA
# =========================
df = pd.read_csv("kidney_disease_dataset.csv")

# =========================
# 2. RENAME COLUMNS
# =========================
column_mapping = {
    "Age of the patient": "age",
    "Blood pressure (mm/Hg)": "bp",
    "Specific gravity of urine": "sg",
    "Albumin in urine": "al",
    "Sugar in urine": "su",
    "Red blood cells in urine": "rbc",
    "Pus cells in urine": "pc",
    "Pus cell clumps in urine": "pcc",
    "Bacteria in urine": "ba",
    "Random blood glucose level (mg/dl)": "bgr",
    "Blood urea (mg/dl)": "bu",
    "Serum creatinine (mg/dl)": "sc",
    "Sodium level (mEq/L)": "sod",
    "Potassium level (mEq/L)": "pot",
    "Hemoglobin level (gms)": "hemo",
    "Packed cell volume (%)": "pcv",
    "White blood cell count (cells/cumm)": "wc",
    "Red blood cell count (millions/cumm)": "rc",
    "Hypertension (yes/no)": "htn",
    "Diabetes mellitus (yes/no)": "dm",
    "Coronary artery disease (yes/no)": "cad",
    "Appetite (good/poor)": "appet",
    "Pedal edema (yes/no)": "pe",
    "Anemia (yes/no)": "ane",
    "Target": "classification"
}

df = df.rename(columns=column_mapping)

# =========================
# 3. SELECT REQUIRED COLUMNS
# =========================
required_cols = [
    "age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba", "bgr", "bu", "sc",
    "sod", "pot", "hemo", "pcv", "wc", "rc", "htn", "dm", "cad", "appet", "pe", "ane", "classification"
]

df = df[required_cols]

# =========================
# 4. HANDLE TARGET FIRST (CRITICAL FIX)
# =========================
df["classification"] = df["classification"].astype(str).str.strip().str.lower()

print("Raw target values:", df["classification"].unique())

mapping = {
    "no_disease": 0,
    "no disease": 0,
    "low_risk": 1,
    "low risk": 1,
    "moderate_risk": 2,
    "moderate risk": 2,
    "high_risk": 3,
    "high risk": 3
}

df["classification"] = df["classification"].map(mapping)

print("After mapping:\n", df["classification"].value_counts(dropna=False))

# Drop invalid rows
df = df.dropna(subset=["classification"])
df["classification"] = df["classification"].astype(int)

# =========================
# 5. PROCESS FEATURES ONLY
# =========================
X = df.drop("classification", axis=1)
y = df["classification"]

# Replace missing symbol
X = X.replace("?", np.nan)

# Convert to string first
for col in X.columns:
    X[col] = X[col].astype(str).str.lower().str.strip()

# Replace categorical values
X = X.replace({
    "yes": 1, "no": 0,
    "normal": 1, "abnormal": 0,
    "present": 1, "notpresent": 0,
    "good": 1, "poor": 0
})

# Convert to numeric
X = X.apply(pd.to_numeric, errors="coerce")

# Fill missing with median
X = X.fillna(X.median(numeric_only=True))

# =========================
# 6. DEBUG CHECK (IMPORTANT)
# =========================
print("\nDataset shape:", X.shape)
print("Class distribution:\n", y.value_counts())

# =========================
# 7. HANDLE IMBALANCE (SMOTE)
# =========================
smote = SMOTE(random_state=42)
X, y = smote.fit_resample(X, y)

print("\nAfter SMOTE:\n", pd.Series(y).value_counts())

# =========================
# 8. TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 9. TRAIN MODEL
# =========================
model = XGBClassifier(
    n_estimators=400,
    max_depth=8,
    learning_rate=0.03,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="multi:softprob",
    num_class=4,
    eval_metric="mlogloss",
    random_state=42
)

model.fit(X_train, y_train)

# =========================
# 10. EVALUATION
# =========================
print("\nClassification Report:\n")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

accuracy = model.score(X_test, y_test)
print("\n✅ Accuracy:", accuracy)

# =========================
# 11. SAVE MODEL
# =========================
joblib.dump(model, "kidney.pkl")
joblib.dump(X.columns.tolist(), "columns.pkl")

# Save median for Flask
joblib.dump(X_train.median(), "median.pkl")

print("\n✅ Model saved successfully!")
