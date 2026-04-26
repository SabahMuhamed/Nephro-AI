import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FIELD_LABELS, initialForm } from "@/constants/fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportUpload from "@/components/ReportUpload";
import { TooltipField } from "@/components/Tooltipfeild";

const categoricalFields = [
  "rbc", "pc", "pcc", "ba",
  "htn", "dm", "cad", "appet", "pe", "ane"
];

const textFields = ["patient_name"];

const Prediction = () => {
  const [formData, setFormData] = useState<Record<string, string>>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setResult } = useApp();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 LIVE VALIDATION
  const getFieldStatus = (key: string, value: string) => {
    if (!value) return { status: "", message: "" };

    const num = parseFloat(value);
    if (isNaN(num)) return { status: "error", message: "Invalid number" };

    const rules: Record<
      string,
      { normal: [number, number]; warning?: [number, number]; label: string }
    > = {
      age: { normal: [1, 120], label: "Age" },

      bp: {
        normal: [90, 120],
        warning: [121, 140],
        label: "Blood Pressure",
      },

      sg: {
        normal: [1.005, 1.025],
        label: "Specific Gravity",
      },

      al: { normal: [0, 1], warning: [2, 5], label: "Albumin" },
      su: { normal: [0, 1], warning: [2, 5], label: "Sugar" },

      bgr: {
        normal: [70, 140],
        warning: [141, 200],
        label: "Glucose",
      },

      bu: {
        normal: [7, 20],
        warning: [21, 60],
        label: "Urea",
      },

      sc: {
        normal: [0.6, 1.2],
        warning: [1.3, 1.5],
        label: "Creatinine",
      },

      sod: {
        normal: [135, 145],
        warning: [130, 150],
        label: "Sodium",
      },

      pot: {
        normal: [3.5, 5],
        warning: [5.1, 6],
        label: "Potassium",
      },

      hemo: {
        normal: [13, 17],
        warning: [10, 12],
        label: "Hemoglobin",
      },

      pcv: {
        normal: [36, 54],
        warning: [30, 35],
        label: "PCV",
      },

      wc: {
        normal: [4000, 11000],
        warning: [11001, 15000],
        label: "WBC",
      },

      rc: {
        normal: [4.5, 6],
        warning: [3.5, 4.4],
        label: "RBC",
      },
    };

    const rule = rules[key];
    if (!rule) return { status: "", message: "" };

    const [min, max] = rule.normal;

    if (num >= min && num <= max) {
      return { status: "success", message: "Normal" };
    }

    if (rule.warning) {
      const [wMin, wMax] = rule.warning;
      if (num >= wMin && num <= wMax) {
        return { status: "warning", message: "Borderline" };
      }
    }

    return { status: "error", message: "Abnormal" };
  };

  // 🔐 FINAL VALIDATION BEFORE SUBMIT
  const validateRange = (key: string, value: number) => {
    switch (key) {
      case "age":
        if (value < 1 || value > 120) return "Age must be 1–120";
        break;
      case "bp":
        if (value < 50 || value > 200) return "BP must be 50–200";
        break;
      case "sc":
        if (value < 0.1 || value > 15) return "Creatinine must be 0.1–15";
        break;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload: Record<string, any> = {};

    for (const key in formData) {
      let val = formData[key];

      if (textFields.includes(key)) {
        if (!val.trim()) {
          setError(`Please enter ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }
        payload[key] = val;
      }

      else if (categoricalFields.includes(key)) {
        if (!val) {
          setError(`Please select ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }
        payload[key] = val.toLowerCase();
      }

      else {
        const num = parseFloat(val);
        if (isNaN(num)) {
          setError(`Invalid value for ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }

        const rangeError = validateRange(key, num);
        if (rangeError) {
          setError(rangeError);
          setIsSubmitting(false);
          return;
        }

        payload[key] = num;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Prediction failed");
        return;
      }

      setResult(data);
      navigate("/result");

    } catch {
      setError("Cannot connect to backend. Ensure Flask is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border mb-6">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                CKD Prediction
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Enter Patient Details
            </h1>

            <p className="text-muted-foreground">
              Fill medical values to analyze CKD risk.
            </p>
          </motion.div>

          {/* ERROR */}
          {error && (
            <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-700 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* REPORT UPLOAD */}
          <ReportUpload
            onValuesExtracted={(values) => {
              setFormData((prev) => ({ ...prev, ...values }));
            }}
          />

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {Object.keys(formData).map((field) => {
                const status = getFieldStatus(field, formData[field]);

                return (
                  <div key={field} className="p-4 border rounded space-y-2">

                    <Label className="flex items-center">
                      {FIELD_LABELS[field]}
                      <TooltipField field={field} />
                    </Label>

                    {categoricalFields.includes(field) ? (
                      <select
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white text-black"
                        required
                      >
                        <option value="">Select</option>

                        {["rbc", "pc"].includes(field) && (
                          <>
                            <option value="normal">Normal</option>
                            <option value="abnormal">Abnormal</option>
                          </>
                        )}

                        {["pcc", "ba"].includes(field) && (
                          <>
                            <option value="present">Present</option>
                            <option value="notpresent">Not Present</option>
                          </>
                        )}

                        {["htn", "dm", "cad", "pe", "ane"].includes(field) && (
                          <>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </>
                        )}

                        {field === "appet" && (
                          <>
                            <option value="good">Good</option>
                            <option value="poor">Poor</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <>
                        <Input
                          type={field === "patient_name" ? "text" : "number"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={
                            status.status === "error"
                              ? "border-red-500"
                              : status.status === "warning"
                                ? "border-yellow-500"
                                : status.status === "success"
                                  ? "border-green-500"
                                  : ""
                          }
                          required
                        />

                        {status.message && (
                          <p
                            className={`text-xs ${status.status === "error"
                              ? "text-red-500"
                              : status.status === "warning"
                                ? "text-yellow-500"
                                : "text-green-500"
                              }`}
                          >
                            {status.message}
                          </p>
                        )}
                      </>
                    )}

                  </div>
                );
              })}

            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-10">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Predicting...
                  </span>
                ) : (
                  "Predict CKD"
                )}
              </Button>
            </div>

          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Prediction;