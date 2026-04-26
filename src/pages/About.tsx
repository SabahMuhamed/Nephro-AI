import { motion } from "framer-motion";
import { Users, Target, Brain, Globe, Mail, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  { name: "AI Research Team", role: "Machine Learning Engineers", desc: "Developed and trained the CKD prediction models." },
  { name: "Medical Advisory", role: "Nephrologists & Data Scientists", desc: "Validated clinical accuracy and medical relevance." },
  { name: "Engineering Team", role: "Full-Stack Developers", desc: "Built the platform and user experience." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            About <span className="glow-text">NephroAI</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We're on a mission to make kidney disease detection accessible to everyone through artificial intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <Target className="w-6 h-6" />, title: "Our Mission", desc: "Early detection of CKD through accessible AI-powered tools that anyone can use." },
            { icon: <Brain className="w-6 h-6" />, title: "Our Approach", desc: "Using Random Forest and XGBoost models trained on real medical datasets with 98% accuracy." },
            { icon: <Globe className="w-6 h-6" />, title: "Our Vision", desc: "A world where preventable kidney disease is caught early, saving millions of lives globally." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                {item.icon}
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="glass-card p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1">{member.name}</h3>
                <p className="text-xs text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">Have questions? Want to collaborate? Reach out to us.</p>
          <div className="flex justify-center gap-4">
            <a href="mailto:contact@nephroai.com" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)] transition-all">
              <Mail className="w-4 h-4" /> Email Us
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-all">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
