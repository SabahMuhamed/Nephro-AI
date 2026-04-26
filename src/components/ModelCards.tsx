import { motion } from "framer-motion";
import { TreePine, Zap } from "lucide-react";

const models = [
  {
    icon: TreePine,
    name: "Random Forest",
    accuracy: "96.5%",
    description: "Ensemble learning model combining multiple decision trees for accurate and stable predictions with excellent generalization.",
    features: ["Handles missing data", "Feature importance ranking", "Low overfitting risk"],
  },
  {
    icon: Zap,
    name: "XGBoost",
    accuracy: "98.2%",
    description: "High-performance gradient boosting algorithm delivering state-of-the-art classification results on medical datasets.",
    features: ["Regularized learning", "Parallel processing", "Cross-validation built-in"],
  },
];

const ModelCards = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold font-heading mb-4">
          Powered by <span className="glow-text">Advanced ML</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Two battle-tested machine learning models working together to deliver the most reliable kidney disease predictions.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {models.map((m, i) => (
          <motion.div
            key={m.name}
            className="glass-card-hover p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <m.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading">{m.name}</h3>
                <span className="text-sm text-primary font-semibold">{m.accuracy} accuracy</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">{m.description}</p>
            <ul className="space-y-2">
              {m.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ModelCards;
