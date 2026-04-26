const Footer = () => (
  <footer className="border-t border-border/50 py-12 bg-secondary/10">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold glow-text">NephroAI</span>
          <span className="text-sm text-muted-foreground">— AI for Kidney Health</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 NephroAI. Built for early detection and better health outcomes.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
