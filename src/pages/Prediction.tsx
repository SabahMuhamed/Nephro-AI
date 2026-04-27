import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { FIELD_LABELS, initialForm } from "@/constants/fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportUpload from "@/components/ReportUpload";
import { TooltipField } from "@/components/Tooltipfeild";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();

  // INPUT HANDLING
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "patient_name") {
      const filtered = value.replace(/[^A-Za-z\s]/g, "");
      setFormData({ ...formData, [name]: filtered });
      return;
    }

    if (!categoricalFields.includes(name)) {
      const filtered = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1");
      setFormData({ ...formData, [name]: filtered });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // VALIDATION
  const getFieldStatus = (key: string, value: string) => {
    if (!value) return { status: "", message: "" };

    // TEXT FIELD (patient name)
    if (key === "patient_name") {
      return value.length < 3
        ? { status: "error", message: "Too short" }
        : { status: "success", message: "Valid" };
    }

    // CATEGORICAL FIELDS
    if (categoricalFields.includes(key)) {
      const abnormal = ["yes", "present", "abnormal", "poor"];
      const normal = ["no", "notpresent", "normal", "good"];

      if (abnormal.includes(value.toLowerCase())) {
        return { status: "error", message: "Abnormal" };
      }

      if (normal.includes(value.toLowerCase())) {
        return { status: "success", message: "Normal" };
      }

      return { status: "", message: "" };
    }

    // NUMERIC FIELDS
    const num = parseFloat(value);
    if (isNaN(num)) return { status: "error", message: "Invalid number" };

    const rules: any = {
      age: { normal: [18, 60], warning: [61, 75] },
      bp: { normal: [90, 120], warning: [121, 140] },
      sg: { normal: [1.005, 1.025] },
      al: { normal: [0, 1], warning: [2, 3] },
      su: { normal: [0, 1], warning: [2, 3] },
      bgr: { normal: [70, 140], warning: [141, 200] },
      bu: { normal: [7, 20], warning: [21, 40] },
      sc: { normal: [0.6, 1.2], warning: [1.3, 1.5] },
      sod: { normal: [135, 145], warning: [130, 150] },
      pot: { normal: [3.5, 5.0], warning: [5.1, 6.0] },
      hemo: { normal: [13, 17], warning: [10, 12] },
      pcv: { normal: [40, 52], warning: [30, 39] },
      wc: { normal: [4000, 11000], warning: [11001, 15000] },
      rc: { normal: [4.5, 6.0], warning: [3.5, 4.4] },
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

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload: Record<string, any> = {};

    for (const key in formData) {
      const val = formData[key];

      if (textFields.includes(key)) {
        if (!val.trim()) {
          setError("Patient name required");
          setIsSubmitting(false);
          return;
        }
        payload[key] = val.trim();
      } else if (categoricalFields.includes(key)) {
        if (!val) {
          setError(`Select ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }
        payload[key] = val.toLowerCase();
      } else {
        const num = parseFloat(val);
        if (isNaN(num)) {
          setError(`Invalid ${FIELD_LABELS[key]}`);
          setIsSubmitting(false);
          return;
        }
        payload[key] = num;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Prediction failed");
        return;
      }

      if (user) {
        await supabase.from("patients").insert([
          {
            user_id: user.id,
            ...payload,
            prediction: data.prediction,
            confidence: data.confidence,
            risk_level: data.risk_level,
          },
        ]);
      }

      setResult(data);
      navigate("/result");

    } catch {
      setError("Backend not running");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">

          <motion.div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Enter Patient Details</h1>
          </motion.div>

          {error && (
            <div className="p-3 bg-red-100 text-red-600 mb-4 rounded text-center">
              {error}
            </div>
          )}

          <ReportUpload
            onValuesExtracted={(values) =>
              setFormData((prev) => ({ ...prev, ...values }))
            }
          />

          <div className="p-6">
            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {Object.keys(formData).map((field) => {
                  const status = getFieldStatus(field, formData[field]);

                  return (
                    <div
                      key={field}
                      className="flex flex-col min-h-[100px]"
                    >
                      <Label className="mb-1 flex items-center gap-1">
                        {FIELD_LABELS[field]}
                        <TooltipField field={field} />
                      </Label>

                      {categoricalFields.includes(field) ? (
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full h-10 p-2 border rounded bg-white text-black"
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
                            className={`h-10 ${status.status === "error"
                              ? "border-red-500"
                              : status.status === "warning"
                                ? "border-yellow-500"
                                : status.status === "success"
                                  ? "border-green-500"
                                  : ""
                              }`}
                            required
                          />

                          <p
                            className={`text-xs h-4 mt-1 ${status.status === "error"
                              ? "text-red-500"
                              : status.status === "warning"
                                ? "text-yellow-500"
                                : "text-green-500"
                              }`}
                          >
                            {!textFields.includes(field) ? status.message : ""}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}

              </div>

              <div className="flex justify-center mt-10">
                <Button className="px-12 py-2 text-lg" type="submit">
                  {isSubmitting ? "Predicting..." : "Predict"}
                </Button>
              </div>

            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Prediction;