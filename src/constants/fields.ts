export const FIELD_LABELS: Record<string, string> = {
  patient_name: "Patient Name",
  age: "Age (years)",
  bp: "Blood Pressure (mm/Hg)",
  sg: "Specific Gravity",
  al: "Albumin",
  su: "Sugar",
  rbc: "Red Blood Cells (0=normal, 1=abnormal)",
  pc: "Pus Cell (0=normal, 1=abnormal)",
  pcc: "Pus Cell Clumps (0=not present, 1=present)",
  ba: "Bacteria (0=not present, 1=present)",
  bgr: "Blood Glucose Random (mg/dL)",
  bu: "Blood Urea (mg/dL)",
  sc: "Serum Creatinine (mg/dL)",
  sod: "Sodium (mEq/L)",
  pot: "Potassium (mEq/L)",
  hemo: "Hemoglobin (g)",
  pcv: "Packed Cell Volume",
  wc: "White Blood Cell Count (cells/cumm)",
  rc: "Red Blood Cell Count (millions/cmm)",
  htn: "Hypertension (0=no, 1=yes)",
  dm: "Diabetes Mellitus (0=no, 1=yes)",
  cad: "Coronary Artery Disease (0=no, 1=yes)",
  appet: "Appetite (0=good, 1=poor)",
  pe: "Pedal Edema (0=no, 1=yes)",
  ane: "Anemia (0=no, 1=yes)",
};

export const initialForm: Record<string, string> = Object.fromEntries(
  Object.keys(FIELD_LABELS).map((k) => [k, ""])
);
