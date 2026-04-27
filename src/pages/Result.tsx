import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Heart,
  ArrowLeft,
  Activity,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import { RISK_COLORS } from "@/constants/colors";
import { FIELD_FULL_NAMES } from "@/constants/feildMap";
import { downloadReportPDF } from "@/constants/downloadReport";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Result = () => {
  const { result } = useApp();
  const navigate = useNavigate();

  const riskColor = RISK_COLORS[result?.risk_level] ?? "#6366f1";

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 text-center">
          <h2>No Results Found</h2>
          <Button onClick={() => navigate("/predict")}>
            Go to Prediction
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isCKD = result.prediction === "ckd";

  // ✅ STATUS FUNCTION
  const getStatus = (field: string, value: any) => {
    if (value === null || value === undefined || value === "") {
      return { color: "text-muted-foreground", label: "Not Available" };
    }

    // TEXT VALUES
    if (typeof value === "string") {
      const val = value.toLowerCase();

      if (["yes", "present", "abnormal", "poor"].includes(val)) {
        return { color: "text-red-500", label: "Abnormal" };
      }

      if (["no", "normal", "notpresent", "good"].includes(val)) {
        return { color: "text-green-500", label: "Normal" };
      }

      return { color: "text-muted-foreground", label: "Normal" };
    }

    // NUMERIC VALUES
    const num = Number(value);
    if (isNaN(num)) {
      return { color: "text-muted-foreground", label: "Not Available" };
    }

    switch (field) {
      case "bp":
        if (num > 140) return { color: "text-red-500", label: "Abnormal" };
        if (num > 120) return { color: "text-yellow-500", label: "Borderline" };
        return { color: "text-green-500", label: "Normal" };

      case "sc":
        if (num > 1.5) return { color: "text-red-500", label: "Abnormal" };
        if (num > 1.2) return { color: "text-yellow-500", label: "Borderline" };
        return { color: "text-green-500", label: "Normal" };

      case "hemo":
        if (num < 10) return { color: "text-red-500", label: "Abnormal" };
        if (num < 13) return { color: "text-yellow-500", label: "Borderline" };
        return { color: "text-green-500", label: "Normal" };

      case "bgr":
        if (num > 200) return { color: "text-red-500", label: "Abnormal" };
        if (num > 140) return { color: "text-yellow-500", label: "Borderline" };
        return { color: "text-green-500", label: "Normal" };

      default:
        return { color: "text-green-500", label: "Normal" };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* BACK BUTTON */}
            <Button
              variant="ghost"
              onClick={() => navigate("/predict")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* ✅ HEADER (PATIENT NAME ONLY HERE) */}
            <div className="glass-card p-6 mb-6">
              <h1 className="text-2xl font-bold mb-2">Medical Report</h1>

              <div className="flex justify-between text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Patient:</span>{" "}
                  {result.patient_name || "N/A"}
                </p>

                <p>
                  <span className="font-medium text-foreground">Date:</span>{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* RESULT */}
            <div className="glass-card p-6 mb-6 text-center">
              <div
                className="inline-flex px-6 py-2 rounded-full text-lg font-bold"
                style={{
                  background: isCKD ? "#ef4444" : "#22c55e",
                  color: "#fff",
                }}
              >
                {isCKD ? "CKD Detected" : "No CKD"}
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                Confidence: {result.confidence}%
              </p>
            </div>

            {/* TABLE */}
            <div className="glass-card p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Lab Test Results
              </h3>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Test</th>
                    <th>Value</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(result.inputs || {})
                    .filter(([key]) => key !== "patient_name") // 🔥 FIX
                    .map(([key, value]: any) => {
                      const status = getStatus(key, value);

                      return (
                        <tr key={key} className="border-b">
                          <td className="py-2">
                            {FIELD_FULL_NAMES[key] || key}
                          </td>

                          <td>
                            {value !== null && value !== "" ? value : "—"}
                          </td>

                          <td className={status.color}>
                            {status.label}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* WARNINGS */}
            {result.warnings?.length > 0 && (
              <div className="glass-card p-6 mb-6 border border-red-300">
                <div className="flex items-center gap-2 text-red-500 mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-semibold">Warnings</h3>
                </div>

                <ul className="text-sm text-red-500">
                  {result.warnings.map((w: string, i: number) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* RECOMMENDATIONS */}
            {result.recommendations?.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5" />
                  <h3 className="font-semibold">Recommendations</h3>
                </div>

                <ul className="text-sm">
                  {result.recommendations.map((r: string, i: number) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={() => downloadReportPDF(result)}>
                Download PDF
              </Button>

              <Button onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </div>

          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Result;