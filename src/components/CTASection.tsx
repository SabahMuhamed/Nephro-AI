import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="relative glass-card p-12 md:p-16 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Take Control of Your <span className="glow-text">Health</span> Today
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
              Early detection saves lives. Get your personalized kidney health assessment in under a minute.
            </p>
            <button
              onClick={() => navigate("/predict")}
              className="px-10 py-4 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.5)] hover:scale-105">
              Check Your Risk Now →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
