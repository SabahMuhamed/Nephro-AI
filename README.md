# Nephro-AI: Chronic Kidney Disease Prediction System

## Overview
Nephro-AI is a machine learning-based web application designed to predict the likelihood of Chronic Kidney Disease (CKD) using clinical and laboratory parameters. The system provides an intuitive interface for users to input medical data and receive predictions along with basic health insights.

This project aims to support early detection of CKD, which is critical for timely medical intervention and improved patient outcomes.

---

## Features
- Predicts CKD based on multiple medical parameters  
- Real-time input validation with normal ranges  
- Highlights abnormal values and critical conditions  
- Provides basic health recommendations  
- User-friendly medical report-style interface  
- Scalable architecture for future integration  

---

## Input Parameters
The model uses the following attributes:

- Age  
- Blood Pressure (bp)  
- Specific Gravity (sg)  
- Albumin (al)  
- Sugar (su)  
- Red Blood Cells (rbc)  
- Pus Cell (pc)  
- Pus Cell Clumps (pcc)  
- Bacteria (ba)  
- Blood Glucose Random (bgr)  
- Blood Urea (bu)  
- Serum Creatinine (sc)  
- Sodium (sod)  
- Potassium (pot)  
- Hemoglobin (hemo)  

---

## Tech Stack

### Frontend
- React.js  
- Vite  
- Tailwind CSS  

### Backend / ML
- Python  
- Scikit-learn  
- Pandas  
- NumPy  

### Other Tools
- Playwright (testing)  
- Vitest (unit testing)  

---

## Machine Learning Model
- Model Type: Classification  
- Algorithms Used: Logistic Regression / Random Forest  
- Dataset: Chronic Kidney Disease dataset  

### Preprocessing
- Handling missing values  
- Encoding categorical variables  
- Feature scaling  

---

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/SabahMuhamed/Nephro-AI.git
cd Nephro-AI
```
2. Frontend setup
```
npm install
npm run dev
```
3. Backend setup 
```
cd Backend
python app.py
```