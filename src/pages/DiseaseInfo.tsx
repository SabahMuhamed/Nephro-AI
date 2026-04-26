import { motion } from "framer-motion";
import { Droplets, AlertCircle, TrendingUp, Shield, Heart, Stethoscope } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stages = [
  { stage: "Stage 1", gfr: "≥ 90", desc: "Kidney damage with normal function. Usually no symptoms.", color: "hsl(168 80% 45%)" },
  { stage: "Stage 2", gfr: "60–89", desc: "Mild decrease in kidney function. Early signs may appear.", color: "hsl(140 60% 45%)" },
  { stage: "Stage 3", gfr: "30–59", desc: "Moderate decrease. Waste products start building up in blood.", color: "hsl(45 90% 50%)" },
  { stage: "Stage 4", gfr: "15–29", desc: "Severe decrease. Preparation for dialysis or transplant.", color: "hsl(20 80% 50%)" },
  { stage: "Stage 5", gfr: "< 15", desc: "Kidney failure. Dialysis or transplant is needed.", color: "hsl(0 84% 60%)" },
];

const symptoms = [
  "Fatigue and weakness",
  "Swelling in feet and ankles",
  "Changes in urination frequency",
  "Nausea and loss of appetite",
  "High blood pressure",
  "Shortness of breath",
  "Muscle cramps",
  "Difficulty concentrating",
];

const riskFactors = [
  { icon: <Heart className="w-5 h-5" />, text: "Diabetes (Type 1 or Type 2)" },
  { icon: <TrendingUp className="w-5 h-5" />, text: "High Blood Pressure" },
  { icon: <Droplets className="w-5 h-5" />, text: "Family History of Kidney Disease" },
  { icon: <Stethoscope className="w-5 h-5" />, text: "Heart Disease" },
  { icon: <AlertCircle className="w-5 h-5" />, text: "Obesity" },
  { icon: <Shield className="w-5 h-5" />, text: "Age over 60" },
];

const DiseaseInfo = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Droplets className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Disease Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Understanding <span className="glow-text">Chronic Kidney Disease</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CKD affects over 850 million people worldwide. Early detection is crucial for effective management and prevention of kidney failure.
          </p>
        </motion.div>

        {/* CKD Stages */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">CKD Stages</h2>
          <div className="space-y-4">
            {stages.map((s, i) => (
              <motion.div
                key={s.stage}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card p-5 flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0" style={{ background: s.color, color: "#fff" }}>
                  {s.stage.split(" ")[1]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading font-semibold">{s.stage}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">GFR: {s.gfr}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Symptoms & Risk Factors */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent" /> Common Symptoms
            </h2>
            <ul className="space-y-3">
              {symptoms.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Risk Factors
            </h2>
            <ul className="space-y-3">
              {riskFactors.map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-primary">{r.icon}</span>
                  {r.text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Prevention */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Prevention is Key</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Maintain a healthy lifestyle, monitor blood pressure and blood sugar, stay hydrated, exercise regularly, and get regular kidney function tests.
          </p>
          <a href="/predict" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-heading font-semibold hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)] transition-all">
            Check Your Risk Now
          </a>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default DiseaseInfo;
