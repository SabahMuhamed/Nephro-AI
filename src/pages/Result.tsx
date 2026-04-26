import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Heart, ArrowLeft, Activity } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { RISK_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Result = () => {
  const { result } = useApp();
  const navigate = useNavigate();

  const riskColor = RISK_COLORS[result?.risk_level] ?? "hsl(var(--primary))";

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-heading font-bold mb-3">No Results Yet</h2>
          <p className="text-muted-foreground mb-8">
            You need to complete the prediction form first.
          </p>
          <Button onClick={() => navigate("/predict")} size="lg">
            <Activity className="w-4 h-4 mr-2" /> Go to Prediction
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

            {/* BACK BUTTON */}
            <Button variant="ghost" onClick={() => navigate("/predict")} className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {/* RESULT CARD */}
            <div className="glass-card p-8 mb-8 text-center">

              <h1 className="text-3xl font-heading font-bold mb-6">
                Prediction Result
              </h1>

              <div
                className="inline-flex px-6 py-3 rounded-full text-lg font-bold mb-4"
                style={{ background: riskColor, color: "#fff" }}
              >
                {result.ckd_detected === "Yes"
                  ? "CKD Detected"
                  : "No CKD"}
              </div>

              {/* CONFIDENCE */}
              {result.confidence && (
                <p className="text-muted-foreground text-sm">
                  Confidence: {result.confidence}%
                </p>
              )}

            </div>

            {/* 🔥 WARNINGS SECTION (NEW) */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="glass-card p-6 mb-6 border border-red-300">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-semibold">Health Warnings</h3>
                </div>

                <ul className="space-y-2">
                  {result.warnings.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-red-500">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* DETAILS */}
            <div className="space-y-6">

              {result.causes?.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-semibold">Possible Causes</h3>
                  </div>

                  <ul className="space-y-2">
                    {result.causes.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations?.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5" />
                    <h3 className="font-semibold">Recommendations</h3>
                  </div>

                  <ul className="space-y-2">
                    {result.recommendations.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.prevention?.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-semibold">Prevention Tips</h3>
                  </div>

                  <ul className="space-y-2">
                    {result.prevention.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center mt-10 gap-4">
              <Button onClick={() => navigate("/predict")} variant="outline">
                New Prediction
              </Button>

              <Button onClick={() => navigate("/dashboard")}>
                View Dashboard
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
