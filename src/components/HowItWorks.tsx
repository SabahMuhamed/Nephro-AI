import { motion } from "framer-motion";
import { ClipboardList, Cpu, ShieldCheck } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Enter Medical Data", desc: "Input your health parameters like blood pressure, hemoglobin, albumin, and other key biomarkers." },
  { icon: Cpu, title: "AI Processes Data", desc: "Our ML models analyze your data against thousands of clinical records in milliseconds." },
  { icon: ShieldCheck, title: "Get Prediction", desc: "Receive an instant risk assessment with personalized health recommendations." },
];

const HowItWorks = () => (
  <section className="py-24 bg-secondary/10">
    <div className="container mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold font-heading mb-4">
          How It <span className="glow-text">Works</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Three simple steps to get your kidney health prediction.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            className="relative text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
            )}

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6 mx-auto">
              <s.icon className="w-8 h-8 text-primary" />
            </div>
            <div className="text-xs text-primary font-heading font-bold mb-2">STEP {i + 1}</div>
            <h3 className="text-xl font-bold font-heading mb-3">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
