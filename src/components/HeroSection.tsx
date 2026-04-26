import { motion } from "framer-motion";
import heroKidney from "@/assets/hero-kidney.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Glow effects */}
      <div className="hero-glow -top-20 -left-20" />
      <div className="hero-glow bottom-0 right-0 opacity-50" style={{ background: "radial-gradient(circle, hsl(340 75% 55% / 0.1) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="pulse-dot" />
            <span className="text-sm text-primary font-medium font-heading">AI-Powered Diagnostics</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6">
            <span className="glow-text">NephroAI</span>
            <br />
            <span className="text-foreground">Chronic Kidney</span>
            <br />
            <span className="text-foreground">Disease Prediction</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            Leveraging advanced machine learning to detect kidney disease early — providing accurate predictions with actionable health insights for better patient outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/predict")}
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] hover:scale-105">
              Start Prediction
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 rounded-lg border border-border bg-secondary/50 text-foreground font-heading font-semibold text-lg transition-all duration-300 hover:border-primary/50 hover:bg-secondary">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right - Kidney visual */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-75" />
            <img
              src={heroKidney}
              alt="AI-powered kidney analysis visualization"
              width={500}
              height={500}
              className="relative z-10 animate-float drop-shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
