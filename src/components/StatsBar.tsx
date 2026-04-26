import { motion } from "framer-motion";

const stats = [
  { value: "98%", label: "Prediction Accuracy" },
  { value: "10K+", label: "Samples Analyzed" },
  { value: "2", label: "ML Models" },
  { value: "24", label: "Health Parameters" },
];

const StatsBar = () => (
  <section className="py-12 border-y border-border/50 bg-secondary/20">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-number">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;
