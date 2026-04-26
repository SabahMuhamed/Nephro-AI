import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/disease-info", label: "Disease Info" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">N</span>
          </div>
          <span className="font-heading font-bold text-lg glow-text">NephroAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors ${location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/predict"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-heading font-semibold transition-all hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
