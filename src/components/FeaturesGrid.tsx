import { motion } from "framer-motion";
import { Database, Brain, Target, Activity, Lock, Globe } from "lucide-react";

const features = [
  { icon: Database, title: "Real-World Dataset", desc: "Trained on cleaned, validated clinical data from thousands of patients." },
  { icon: Brain, title: "Smart Algorithms", desc: "Advanced ensemble and gradient boosting models for precise classification." },
  { icon: Target, title: "98% Accuracy", desc: "Industry-leading prediction performance validated through rigorous testing." },
  { icon: Activity, title: "Health Insights", desc: "Detailed breakdown of risk factors with personalized recommendations." },
  { icon: Lock, title: "Privacy First", desc: "Your medical data is processed locally and never stored on our servers." },
  { icon: Globe, title: "Future Ready", desc: "Upcoming integration with X-ray analysis and deep learning diagnostics." },
];

const FeaturesGrid = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold font-heading mb-4">
          Why <span className="glow-text">NephroAI</span>?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Built with cutting-edge technology and a patient-first approach.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass-card-hover p-6 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-heading mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
